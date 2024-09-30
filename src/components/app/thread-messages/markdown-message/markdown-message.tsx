import { MemoizedReactMarkdown } from "@/components/ui/markdown";
import rehypeExternalLinks from "rehype-external-links";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { CodeBlock } from "@/components/ui/codeblock";

export default function MarkdownMessage({ content }: { content: string }) {
  // const content = `This message demonstrates the use of a complex LaTeX formula: \\[ E = mc^2 + \\int_{a}^{b} x^2 \\, dx \\] which represents the equivalence of mass and energy along with the area under the curve of a quadratic function.`

  // Check if the content contains LaTeX patterns
  const containsLaTeX = /\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/.test(
    content || ""
  );
  // Modify the content to render LaTeX equations if LaTeX patterns are found
  const processedContent = preprocessLaTeX(content || "").trim();
  const processedData = processedContent.startsWith("Thank you")
    ? processedContent.replace(/^Thank you[^.]*\./, "").trim()
    : processedContent;

  return (
    <MemoizedReactMarkdown
      rehypePlugins={[
        [rehypeExternalLinks, { target: "_blank" }],
        ...(containsLaTeX ? [rehypeKatex] : []),
      ]}
      remarkPlugins={[remarkGfm, remarkMath]}
      className="react-markdown prose-sm prose-neutral prose-a:text-accent-foreground/50"
      components={{
        a({ node, ...props }) {
          return (
            <a
              {...props}
              className={`!text-pink-500 hover:!text-pink-700 duration-200`}
            />
          );
        },
        code({ node, inline, className, children, ...props }) {
          if (children.length) {
            if (children[0] == "▍") {
              return (
                <span className="mt-1 cursor-default animate-pulse">▍</span>
              );
            }

            children[0] = (children[0] as string).replace("`▍`", "▍");
          }

          const match = /language-(\w+)/.exec(className || "");

          if (inline) {
            return (
              <code className={className} {...props}>
                {children}
              </code>
            );
          }

          return (
            <CodeBlock
              key={Math.random()}
              language={(match && match[1]) || ""}
              value={String(children).replace(/\n$/, "")}
              {...props}
            />
          );
        },
        img({ node, ...props }) {
          return (
            <div className="relative w-full h-[300px] rounded-[16px] overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center blur-sm"
                style={{ backgroundImage: `url(${props.src})` }}
              ></div>
              <div className="absolute inset-0 bg-black/70"></div>
              <div className="relative flex items-center justify-center w-full h-full">
                <img
                  {...props}
                  className="h-[300px] object-cover shadow-md mb-0 mt-0"
                />
              </div>
            </div>
          );
        },
      }}
    >
      {processedData}
    </MemoizedReactMarkdown>
  );
}

// Preprocess LaTeX equations to be rendered by KaTeX
// ref: https://github.com/remarkjs/react-markdown/issues/785
const preprocessLaTeX = (content: string) => {
  const blockProcessedContent = content.replace(
    /\\\[([\s\S]*?)\\\]/g,
    (_, equation) => `$$${equation}$$`
  );
  const inlineProcessedContent = blockProcessedContent.replace(
    /\\\(([\s\S]*?)\\\)/g,
    (_, equation) => `$${equation}$`
  );
  return inlineProcessedContent;
};
