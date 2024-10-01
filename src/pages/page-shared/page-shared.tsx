import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/lib/supabase/supabase";
import ThreadMessages from "@/components/app/thread-messages/thread-messages";
import { WritingSkeleton } from "@/components/app/writing-skeleton/writing-skeleton";
import { toast } from "sonner";

// ... existing imports ...

const PageShared = () => {
  const navigate = useNavigate();
  const { shareID } = useParams<{ shareID: string }>();
  const [loading, setLoading] = useState(true);
  const [messageGroups, setMessageGroups] = useState([]);

  const fetchThreadData = async () => {
    if (shareID) {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("one_srswti_thread_groups")
          .select("*")
          .eq("thread_id", shareID);

        if (error) {
          throw error;
        }
        const filteredData = (data || []).filter((group) => group.query);

        if (filteredData?.length) {
          setMessageGroups(filteredData);
        } else {
          throw new Error("No messages found");
        }
      } catch (error) {
        console.error("Error fetching thread:", error);
        toast.error("This link has been expired.");
        navigate("/search");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchThreadData();
  }, [shareID]);

  console.log(loading, messageGroups);
  return (
    <article className="w-full max-w-4xl mx-auto p-4 mt-6 ">
      {!loading && <ThreadMessages messageGroups={messageGroups} />}

      {!loading && !messageGroups?.length ? (
        <p className="text-2xl mx-auto">No messages found.</p>
      ) : null}

      {loading && (
        <div className="mt-4">
          <WritingSkeleton />
        </div>
      )}

      <div className="h-32"></div>
    </article>
  );
};

export default PageShared;
