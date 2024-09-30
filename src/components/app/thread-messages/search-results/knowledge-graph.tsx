import React, { useEffect, useState, useCallback } from "react";
import ReactFlow, {
  Node,
  Edge,
  Position,
  MarkerType,
  Handle,
  useReactFlow,
  ReactFlowProvider,
} from "reactflow";
import "reactflow/dist/style.css";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn, getDomainFromLink, truncateStringWithEllipsis } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";

import KnowledgeGraphModal from "./knowledge-graph-modal";
import AccordionHeader from "./knowledge-graph-steps";
import { Fullscreen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchResultWebsite } from "@/lib/types";

const calculateNodePosition = (index: number, totalNodes: number) => {
  const nodeWidth = 400; // Width of the node
  const nodeHeight = 100; // Approximate height of the node
  const padding = 40; // Minimum space between nodes

  const baseRadius = 300; // Minimum radius
  const radiusStep = Math.max(nodeHeight, nodeWidth) + padding;

  const nodesPerCircle = Math.floor(
    (2 * Math.PI * baseRadius) / (nodeWidth + padding)
  );
  const circleIndex = Math.floor(index / nodesPerCircle);
  const angleStep =
    (2 * Math.PI) /
    Math.min(nodesPerCircle, totalNodes - circleIndex * nodesPerCircle);
  const angle = (index % nodesPerCircle) * angleStep;

  const radius = baseRadius + circleIndex * radiusStep;

  return {
    x: radius * Math.cos(angle),
    y: radius * Math.sin(angle),
  };
};

const calculateTagNodePosition = (
  centerX: number,
  centerY: number,
  index: number,
  totalTags: number
) => {
  const radius = 150; // Adjust this value to change the distance from the center
  const startAngle = -Math.PI / 2; // Start from the top (12 o'clock position)
  const angleStep = (2 * Math.PI) / totalTags;

  const angle = startAngle + index * angleStep;

  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle),
  };
};
const MainNode = ({ data: { pending } }) => {
  return (
    <div className="min-h-[40px] px-4 max-w-lg rounded-xl bg-transparent text-white text-xs flex items-center justify-center">
      <div className=" translate-y-1/2">
        <img
          src="https://api.srswti.com/storage/v1/object/public/srswti_public/medias/srswti-pink-no-title.png"
          alt="Centered Image"
          className={cn(
            "max-w-full h-auto w-20 [animation-duration:2s]",
            pending ? 'animate-spin "' : ""
          )}
        />
      </div>

      <Handle type="source" position={Position.Bottom} id="a" />
    </div>
  );
};

const TagNode = ({ data }) => {
  const { label, tagIndex } = data;

  return (
    <div>
      <motion.div
        className="px-2 py-1 rounded-[10px] bg-[rgba(103,43,143,0.3)] text-white text-[8px] border border-white/10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          type: "spring",
          stiffness: 100,
          damping: 10,
          delay: tagIndex * 0.25,
        }} // Adjust delay based on tagIndex
      >
        {label}
      </motion.div>

      <Handle type="target" position={Position.Top} />
    </div>
  );
};

const ResultNode = ({
  data,
}: {
  data: { result: SearchResultWebsite; showSummary: any };
}) => {
  const result = data?.result;
  const showSummary = data?.showSummary;
  const domain = getDomainFromLink(result.href);

  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    // hack to avoid animation on first render; for some reason nodes were animating from position 0
    // to their initial position
    setAnimated(true);
  }, []);

  return (
    <motion.div
      layout={animated}
      onClick={() => {
        showSummary(result);
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 10,
      }}
      key={result.title.concat(animated.toString())}
      className="w-[200px] btn-effect duration-200 hover:opacity-70 cursor-pointer rounded-2xl bg-[rgb(103,43,143)] hover:bg-primary/60 border border-white/20 text-white text-[10px] p-2 px-3 overflow-hidden"
    >
      <Handle type="target" position={Position.Top} />
      <span className="text-[8px] opacity-70">{domain}</span>
      <p>{truncateStringWithEllipsis(result.title, 150)}</p>

      <Handle type="source" position={Position.Bottom} id="a" />
    </motion.div>
  );
};

const nodeTypes = {
  main: MainNode,
  result: ResultNode,
  tag: TagNode,
};

interface KnowledgeGraphContentProps {
  pending: boolean;
  maxResults: number;
  searchResult: SearchResultWebsite[];
  query: string;
}

const KnowledgeGraphContent = ({
  maxResults,
  query,
  pending,
  searchResult,
}: KnowledgeGraphContentProps) => {
  const results = searchResult;
  const [showFullScreen, setshowFullScreen] = useState(false);
  console.log(searchResult);
  const [edges, setEdges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [activeSummary, setActiveSummary] =
    useState<SearchResultWebsite | null>(null);
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "main",
      data: { label: query, pending },
      position: { x: 0, y: 0 },
      type: "main",
    },
  ]);

  useEffect(() => {
    setNodes((currentNodes) =>
      currentNodes.map((node) =>
        node.id === "main" ? { ...node, data: { ...node.data, pending } } : node
      )
    );
  }, [pending]);

  const showSummary = (data: SearchResultWebsite) => {
    setShowModal(true);
    setActiveSummary(data);
  };

  const { fitView } = useReactFlow();

  const divideWithMaxResult = maxResults === 10 ? 2 : 1;
  const activeTimelineIndex = Math.ceil(
    ((results?.length || 0) + 1) / divideWithMaxResult
  );

  const fitViewOnNodesChange = useCallback(() => {
    fitView({ padding: 0.2, duration: 200 });
  }, [fitView]);

  const initializeNodes = () => {
    if (!results?.length) return;

    const newNodes: Node[] = [
      {
        id: "main",
        data: { label: query, pending },
        position: { x: 0, y: 0 },
        type: "main",
      },
    ];

    results.forEach((result, resultIndex: number) => {
      const resultPosition = calculateNodePosition(resultIndex, results.length);

      // Add result node
      newNodes.push({
        id: `result-${resultIndex}`,
        data: { showSummary, result },
        position: resultPosition,
        type: "result",
      });

      result.keywords?.slice(0, 5).forEach((tag: string, tagIndex: number) => {
        const tagPosition = calculateTagNodePosition(
          resultPosition.x,
          resultPosition.y,
          tagIndex,
          Math.min(result.keywords?.length || 0, 5)
        );
        newNodes.push({
          id: `tag-${resultIndex}-${tagIndex}`,
          data: { label: tag, tagIndex },
          position: tagPosition,
          type: "tag",
        });
      });
    });

    setNodes(newNodes);
    fitViewOnNodesChange();
  };

  useEffect(() => {
    initializeNodes();
    fitViewOnNodesChange();
  }, [results, query, pending]);

  useEffect(() => {
    if (!results?.length) return;

    const resultEdges: Edge[] =
      results?.map((_, index) => ({
        id: `edge-${index}`,
        source: "main",
        target: `result-${index}`,
        type: "default",
        animated: true,
        style: {
          stroke: "rgba(255, 255, 255, 0.2)",
          strokeWidth: 2,
          strokeDasharray: "5 5",
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "rgba(255, 255, 255, 0.2)",
        },
      })) || [];

    const tagEdges: Edge[] =
      results.flatMap?.((result, resultIndex: number) => {
        return (result?.keywords || []).map(
          (tag: string, tagIndex: number) => ({
            id: `edge-${resultIndex}-${tagIndex}`,
            source: `result-${resultIndex}`,
            target: `tag-${resultIndex}-${tagIndex}`,
            type: "default",
            animated: true,
            style: {
              stroke: "rgba(255, 255, 255, 0.2)",
              strokeWidth: 2,
              strokeDasharray: "5 5",
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: "rgba(255, 255, 255, 0.2)",
            },
          })
        );
      }) || [];

    setEdges([...resultEdges, ...tagEdges]);
  }, [results]);

  return (
    <>
      <Dialog open={showFullScreen} onOpenChange={setshowFullScreen}>
        <DialogContent className=" h-[100svh] flex flex-col !rounded-[16px] p-5 md:p-10 w-[100svw] max-w-[98svw] sm:max-w-[80svw] bg-black/50 backdrop-blur-sm">
          <DialogTitle className="">Searched for {query}</DialogTitle>

          <div className="bg-primary/10 rounded-[8px] mt-4 h-full">
            {showFullScreen && (
              <ReactFlow
                nodes={nodes}
                elementsSelectable={true}
                edges={edges}
                defaultViewport={{ x: 0, y: 0, zoom: 0.1 }}
                nodeTypes={nodeTypes}
                fitView
                nodesDraggable={false}
                proOptions={{ hideAttribution: true }}
                nodesConnectable={false}
              />
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showModal}
        onOpenChange={(val) => {
          setShowModal(val);

          if (!val) setActiveSummary(null);
        }}
      >
        <DialogTrigger></DialogTrigger>
        <DialogContent className="max-w-5xl p-6 border-white/10 bg-primary/20 backdrop-blur-lg">
          <KnowledgeGraphModal activeSummary={activeSummary} />
        </DialogContent>
      </Dialog>

      <Accordion
        type="single"
        defaultValue="item-1"
        collapsible
        className="bg-primary/10 border border-white/20 rounded-2xl !mt-0 overflow-hidden"
      >
        <AccordionItem value="item-1" className="border-0">
          <AccordionTrigger className="border-b border-white/20 px-6 hover:opacity-80 active:scale-[0.98]">
            <AccordionHeader
              pending={pending}
              query={query}
              activeTimelineIndex={activeTimelineIndex}
            />
          </AccordionTrigger>

          <AccordionContent className="relative ">
            <Button
              size="icon"
              onClick={() => setshowFullScreen(true)}
              variant={"ghost"}
              className="opacity-80 absolute top-4 right-4 z-10"
            >
              <Fullscreen className="size-5" />
            </Button>
            <div className="h-[450px] w-full">
              {!showFullScreen && (
                <ReactFlow
                  nodes={nodes}
                  elementsSelectable={true}
                  edges={edges}
                  defaultViewport={{ x: 0, y: 0, zoom: 0.1 }}
                  nodeTypes={nodeTypes}
                  fitView
                  nodesDraggable={false}
                  nodesConnectable={false}
                  proOptions={{ hideAttribution: true }}
                />
              )}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </>
  );
};

const KnowledgeGraph = (props: KnowledgeGraphContentProps) => (
  <ReactFlowProvider>
    <KnowledgeGraphContent {...props} />
  </ReactFlowProvider>
);

export default KnowledgeGraph;
