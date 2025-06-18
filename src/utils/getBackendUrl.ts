export const getBackendUrl = (path: string) => {
  if (process.env.ENV_NODE === "prod") {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL_PROD}${path}`;
  } else {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${path}`;
  }
};
