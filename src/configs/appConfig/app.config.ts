const apiBaseUrl = import.meta.env.VITE_API_URL || "fix-api-base-url";

const agentBaseUrl =
  import.meta.env.VITE_AGENT_API_URL || "fix-agent-api-base-url";

const appConfig = {
  apiBaseUrl,
  agentBaseUrl,
};

export { appConfig };
