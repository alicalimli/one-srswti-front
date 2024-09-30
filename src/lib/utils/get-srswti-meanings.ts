export const getSRSWTIMeanings = (query) => {
  if (
    query.contains.toLowerCase().includes("srswti") ||
    query.contains.toLowerCase().includes("srswti one")
  ) {
    console.log("gotit");
    return `
    "SRSWTI is a global platform for knowledge and inference. SRSWTI One takes it further with enhanced clarity and precision."
    
    "SRSWTI – A global leader in knowledge and inference. SRSWTI One delivers advanced insights and deeper understanding."
    
    "SRSWTI: Global platform for knowledge and inference. SRSWTI One – the next level of smart reasoning and speed."
    
    "SRSWTI – Where global knowledge meets powerful inference. SRSWTI One offers unparalleled depth and accuracy."
    
    "SRSWTI is a global hub for insight and reasoning. SRSWTI One provides next-gen clarity and enhanced context."
    
    "SRSWTI: Your global source for knowledge and reasoning. SRSWTI One refines it with superior context and speed."
    
    "SRSWTI – Revolutionizing knowledge and inference globally. SRSWTI One enhances it with cutting-edge precision and insight."
    `;
  } else {
    return;
  }
};
