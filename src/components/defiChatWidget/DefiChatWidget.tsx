import {
  Box,
  IconButton,
  Paper,
  TextField,
  Typography,
  useTheme,
  useMediaQuery,
  Fab,
  Tooltip,
} from "@mui/material";
// import MinimizeIcon from "@mui/icons-material/Minimize";
import CloseIcon from "@mui/icons-material/Close";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import SendIcon from "@mui/icons-material/Send";
// import ChatIcon from "@mui/icons-material/Chat";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import RefreshIcon from "@mui/icons-material/Refresh";
import SouthIcon from "@mui/icons-material/South";
import { motion } from "framer-motion";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const AssistantTyping = () => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        DEFI is thinking
      </Typography>

      <Box sx={{ display: "flex", gap: 0.5 }}>
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            animate={{ opacity: [0.2, 1, 0.2] }}
            transition={{
              duration: 1.2,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              backgroundColor: "currentColor",
              display: "inline-block",
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

const INITIAL_GREETING =
  "Hello! I'm your learning assistant. How can I help you today?";

const ChatWidget = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [isOpen, setIsOpen] = useState(false);
  //   const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [threadId, setThreadId] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);
  //   const [isTyping, setIsTyping] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const isStreamingRef = useRef(false);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const isUserAtBottomRef = useRef(true);

  const [showNewMessageIndicator, setShowNewMessageIndicator] = useState(false);

  const AGENT_API_BASE_URL = import.meta.env.VITE_AGENT_API_URL;

  useEffect(() => {
    const seen = localStorage.getItem("defi_widget_tooltip_seen");
    if (!seen) {
      setShowTooltip(true);
      localStorage.setItem("defi_widget_tooltip_seen", "true");
    }
  }, []);

  /* ---------------- Initial greeting ---------------- */
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: INITIAL_GREETING,
        },
      ]);
    }
  }, [isOpen, messages.length]);

  /* ---------------- Auto scroll ---------------- */
  //   useEffect(() => {
  //     //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  //     messagesEndRef?.current?.scrollIntoView({
  //       behavior: isStreamingRef.current ? "auto" : "smooth",
  //     });
  //   }, [messages]);

  //   useEffect(() => {
  //     if (!messagesEndRef.current) return;

  //     messagesEndRef.current.scrollIntoView({
  //       behavior: isStreamingRef.current ? "auto" : "smooth",
  //     });
  //   }, [messages]);
  useEffect(() => {
    if (!messagesEndRef.current) return;
    if (!isUserAtBottomRef.current) return;

    messagesEndRef.current.scrollIntoView({
      behavior: isStreamingRef.current ? "auto" : "smooth",
    });
  }, [messages]);

  /* ---------------- Send message ---------------- */
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    // SINGLE state update (important)
    setMessages((prev) => [
      ...prev,
      userMessage,
      { role: "assistant", content: "" },
    ]);

    setInput("");

    // const endpoint = threadId
    //   ? `http://localhost:8000/chat/${threadId}`
    //   : "http://localhost:8000/chat";
    const endpoint = threadId
      ? `${AGENT_API_BASE_URL}/chat/${threadId}`
      : `${AGENT_API_BASE_URL}/chat`;

    try {
      isStreamingRef.current = true;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });

      if (!res.body) {
        throw new Error("ReadableStream not supported");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        // SSE framing
        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const event of events) {
          if (!event.startsWith("data:")) continue;

          const json = event.replace(/^data:\s*/, "");
          const payload = JSON.parse(json);

          if (payload.token) {
            setMessages((prev) => {
              const updated = [...prev];
              const last = updated[updated.length - 1];

              if (last?.role === "assistant") {
                // immutable update
                updated[updated.length - 1] = {
                  ...last,
                  content: last.content + payload.token,
                };
              }

              return updated;
            });
          }

          if (payload.threadId) {
            setThreadId(payload.threadId);
          }

          if (payload.done) {
            isStreamingRef.current = false;
            reader.cancel();
          }
        }
      }
    } catch (error) {
      isStreamingRef.current = false;
      console.error("Streaming error:", error);
    }
  };

  //   const handleSend = async () => {
  //     if (!input.trim()) return;

  //     const userMessage: Message = {
  //       role: "user",
  //       content: input,
  //     };

  //     setMessages((prev) => [...prev, userMessage]);
  //     setInput("");

  //     const endpoint = threadId
  //       ? `http://localhost:8000/chat/${threadId}`
  //       : "http://localhost:8000/chat";

  //     try {
  //       const res = await fetch(endpoint, {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ message: userMessage.content }),
  //       });

  //       if (!res.ok) {
  //         throw new Error(`HTTP error ${res.status}`);
  //       }

  //       const data: { threadId: string; response: string } = await res.json();

  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           role: "assistant",
  //           content: data.response,
  //         },
  //       ]);

  //       setThreadId(data.threadId);
  //     } catch (error) {
  //       console.error("Chat error:", error);
  //     }
  //   };

  const handleRefreshChat = () => {
    setMessages([
      {
        role: "assistant",
        content: INITIAL_GREETING,
      },
    ]);
    setThreadId(null);
    setInput("");
    setShowNewMessageIndicator(false);
  };

  /* ---------------- Closed state button ---------------- */
  if (!isOpen) {
    return (
      <Tooltip
        open={showTooltip}
        placement="top"
        arrow
        disableHoverListener
        disableFocusListener
        disableTouchListener
        slotProps={{
          tooltip: {
            sx: {
              bgcolor: "rgba(17, 25, 40, 0.95)",
              backdropFilter: "blur(8px)",
              borderRadius: 2,
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.12)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              maxWidth: 280,
              p: 2,
            },
          },
          arrow: {
            sx: {
              color: "rgba(17, 25, 40, 0.95)",
              "&::before": {
                border: "1px solid rgba(255, 255, 255, 0.1)",
              },
            },
          },
        }}
        title={
          <Box>
            <Box
              display="flex"
              alignItems="flex-start"
              justifyContent="space-between"
              gap={1.5}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: "0.875rem",
                  lineHeight: 1.5,
                  color: "rgba(255, 255, 255, 0.95)",
                }}
              >
                Need help? I can recommend{" "}
                <Box component="span" sx={{ fontWeight: 600, color: "#fff" }}>
                  courses
                </Box>
                ,{" "}
                <Box component="span" sx={{ fontWeight: 600, color: "#fff" }}>
                  skills
                </Box>
                , and{" "}
                <Box component="span" sx={{ fontWeight: 600, color: "#fff" }}>
                  learning paths
                </Box>
                .
              </Typography>

              <IconButton
                size="small"
                sx={{
                  p: 0.5,
                  color: "rgba(255, 255, 255, 0.7)",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.1)",
                    color: "rgba(255, 255, 255, 0.9)",
                  },
                  transition: "all 0.2s ease",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setShowTooltip(false);
                }}
              >
                <CloseIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Box>
          </Box>
        }
      >
        <Fab
          color="primary"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            "&:hover": {
              transform: "scale(1.05)",
              boxShadow: "0 6px 24px rgba(0, 0, 0, 0.2)",
            },
            transition: "all 0.2s ease",
          }}
          onClick={() => setIsOpen(true)}
        >
          <SmartToyIcon />
        </Fab>
      </Tooltip>
    );
  }

  return (
    <Paper
      elevation={6}
      sx={{
        position: "fixed",
        bottom: 16,
        right: 16,
        width: isMaximized
          ? isMobile
            ? "95vw"
            : "80vw"
          : isMobile
          ? "90vw"
          : 380,
        height: isMaximized ? (isMobile ? "90vh" : "80vh") : 520,
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        overflow: "hidden",
        bgcolor: "background.paper",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "primary.main",
        }}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <SmartToyIcon />
          <Typography variant="subtitle1" fontWeight={600}>
            DEFI
          </Typography>
        </Box>

        <Box>
          {/* <IconButton
            size="small"
            onClick={() => {
              setIsMinimized((p) => !p);
              setIsMaximized(false);
            }}
          >
            <MinimizeIcon fontSize="small" />
          </IconButton> */}
          <IconButton
            size="small"
            onClick={handleRefreshChat}
            title="Start new chat"
          >
            <RefreshIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setIsMaximized((p) => !p)}>
            <CropSquareIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => setIsOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      {/* ( */}
      <>
        {/* Messages */}
        <Box
          ref={messagesContainerRef}
          onScroll={() => {
            if (!messagesContainerRef.current) return;

            const { scrollTop, scrollHeight, clientHeight } =
              messagesContainerRef.current;

            const isAtBottom = scrollHeight - scrollTop - clientHeight < 20;

            isUserAtBottomRef.current = isAtBottom;
            setShowNewMessageIndicator(!isAtBottom);
          }}
          sx={{
            flex: 1,
            px: 2,
            py: 1,
            overflowY: "auto",
            bgcolor: "background.default",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {messages.map((msg, idx) => (
            <Box
              key={idx}
              sx={{
                mb: 1.5,
                display: "flex",
                justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  maxWidth: "80%",
                  px: 1.5,
                  py: 1,
                  borderRadius: 2,
                  bgcolor:
                    msg.role === "user"
                      ? "primary.main"
                      : theme.palette.mode === "dark"
                      ? "grey.800"
                      : "grey.200",
                  color: "text.primary",
                  typography: "body2",
                }}
              >
                {/* {msg.role === "assistant" ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      table: ({ children }) => (
                        <Box sx={{ overflowX: "auto" }}>
                          <table>{children}</table>
                        </Box>
                      ),
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                ) : (
                  msg.content
                )} */}
                {msg.role === "assistant" ? (
                  msg.content ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        table: ({ children }) => (
                          <Box sx={{ overflowX: "auto" }}>
                            <table>{children}</table>
                          </Box>
                        ),
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    isStreamingRef.current && <AssistantTyping />
                  )
                ) : (
                  msg.content
                )}
              </Box>
            </Box>
          ))}

          {showNewMessageIndicator && (
            <Box
              sx={{
                position: "sticky",
                bottom: 8,
                display: "flex",
                justifyContent: "center",
                zIndex: 10,
              }}
            >
              <Box
                onClick={() => {
                  messagesEndRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                  isUserAtBottomRef.current = true;
                  setShowNewMessageIndicator(false);
                }}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                  transition: "transform 0.15s ease, opacity 0.15s ease",
                  "&:hover": {
                    opacity: 0.9,
                    transform: "scale(1.05)",
                  },
                }}
              >
                <SouthIcon
                  sx={{
                    fontSize: 20, // ⬅ bigger icon
                    lineHeight: 1,
                  }}
                />
              </Box>
            </Box>
          )}

          <div ref={messagesEndRef} />
        </Box>

        {/* Input */}
        <Box
          sx={{
            display: "flex",
            gap: 1,
            p: 1,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <TextField
            fullWidth
            size="small"
            placeholder="Search courses, skills, learning paths or get recommendations…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={!input.trim()}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </>
      {/* ) */}
    </Paper>
  );
};

export default ChatWidget;
