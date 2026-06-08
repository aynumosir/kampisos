export const toHref = (uri: string): string => {
  if (uri.startsWith("http")) {
    return uri;
  }

  if (uri.startsWith("urn:isbn:")) {
    const isbn = uri.replace(/^urn:isbn:/, "");
    return `https://isbnsearch.org/isbn/${isbn}`;
  }

  if (uri.startsWith("urn:issn:")) {
    const issn = uri.replace(/^urn:issn:/, "");
    return `https://portal.issn.org/resource/ISSN/${issn}`;
  }

  throw new Error("Unknown URN provied");
};
