import { useAppDispatch, useAppSelector } from "@/lib/hooks/use-redux";
import {
  getReducerAppState,
  setAppStateReducer,
} from "@/lib/redux/slices/slice-app-state";
import { getUserState } from "@/lib/redux/slices/user";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Loader2, CheckIcon } from "lucide-react";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import BillingNyuSteps from "./billing-nyu-steps";
import { googleSignIn } from "@/lib/redux/action/actions-user";
import { supabase } from "@/lib/supabase/supabase";

const BillingDialog = () => {
  const { isAnonymous, subscription, nyuStudent, user } =
    useAppSelector(getUserState);

  const { showBilling } = useAppSelector(getReducerAppState);
  const [loading, setloading] = useState(false);
  const [showNYUSteps, setShowNYUSteps] = useState(false);

  const dispatch = useAppDispatch();

  const manageSubscriptions = async () => {
    setloading(true);

    const { data, error } = await supabase.functions.invoke(
      "create-billing-portal",
      {
        body: {
          customer_id: subscription?.customer_id,
          return_url: window.location.origin,
        },
      }
    );

    if (data) {
      window.location.href = data.url;
    } else {
      console.log("coudnt create the billing portal");
    }

    setloading(false);
  };

  const cancelDate = subscription?.is_cancelled
    ? format(new Date(subscription.is_cancelled * 1000), "MMMM d, yyyy")
    : "";
  return false ? null : (
    <>
      {showNYUSteps && (
        <BillingNyuSteps show={showNYUSteps} setShow={setShowNYUSteps} />
      )}

      <Dialog
        open={showBilling}
        onOpenChange={(e) => dispatch(setAppStateReducer({ showBilling: e }))}
      >
        <DialogContent className="!w-[90%] pro-container h-fit max-w-4xl p-16">
          <ScrollArea>
            <header className="text-center mb-6">
              {" "}
              <h4 className="text-3xl">SRSWTI ONE</h4>
              <p className="text-lg mt-1 opacity-60">
                Supercharge your learning.
              </p>
            </header>

            {subscription?.customer_id ? (
              <section
                className={`bg-secondary/20 rounded-[8px] text-center w-full h-[40rem] flex justify-center items-center flex-col mx-auto`}
              >
                <h3 className={` text-3xl font-medium`}>
                  {subscription?.is_subscribed
                    ? "Pro Plan"
                    : "Reactivate Your Premium Plan"}
                </h3>
                <p className="max-w-sm opacity-80 mb-4">
                  {subscription?.is_cancelled
                    ? `You'll lose access to all paid features and we'll stop tracking your
  metrics after ${cancelDate}.`
                    : subscription?.is_subscribed
                    ? "You are on the pro plan, you can manage your subscription by clicking the button below."
                    : "You've been downgraded to free plan. To continue enjoying our services, please reactivate your subscription below."}
                </p>
                <Button
                  onClick={manageSubscriptions}
                  className={` ${
                    subscription?.is_cancelled ? "bg-orange-700" : ""
                  }`}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {subscription?.is_cancelled
                    ? "Reactive Subscription"
                    : subscription?.is_subscribed
                    ? "Manage Subscription"
                    : "Reactivate Subscription"}
                </Button>
              </section>
            ) : (
              <div className="flex flex-col-reverse md:flex-row items-center xl:items-start  justify-center mx-auto w-full gap-12 pt-8">
                {user?.id && !nyuStudent ? (
                  <stripe-pricing-table
                    client-reference-id={user?.id}
                    pricing-table-id="prctbl_1Q1Fk4F12VfKUrW3x9Kc9Cj9"
                    publishable-key="pk_test_51N2eKCF12VfKUrW35Abt6nJyVG1fby3oE4wfI6Sc4rQPzuvJEqE80Jenxta57u0AOiRfxqp75NNIC1ePeRDqOabP00IL5np8GV"
                  ></stripe-pricing-table>
                ) : (
                  <div className="w-full h-96 p-12 mt-4 pt-8 max-w-[20rem]">
                    <h6 className="text-xl font-medium">SRSWTI One Premium</h6>
                    <p className="text-sm opacity-60 mb-8">Unlimited Access</p>

                    <h3 className="text-4xl font-bold">
                      $99.99{" "}
                      <span className="text-sm opacity-60 font-normal">
                        / month
                      </span>
                    </h3>

                    <Button
                      disabled={nyuStudent}
                      variant={"secondary"}
                      onClick={() => {
                        dispatch(googleSignIn());
                      }}
                      className={`rounded-full mt-4 w-full h-fit py-3.5`}
                    >
                      Get Started
                    </Button>

                    {/* <small className="block mt-3">This includes:</small> */}
                    <ul className="flex flex-col gap-2.5 mt-2.5">
                      {/* {freeFeatures.map((f, i) => (
                      <li key={i} className="flex items-center gap-2.5">
                        <div className="bg-slate-600 rounded-full p-0.5">
                          <CheckIcon className="size-3 rouded-full " />{" "}
                        </div>{" "}
                        <span className="text-[12px] text-white">
                          {" "}
                          {f}
                        </span>
                      </li>
                    ))} */}
                    </ul>

                    <div className="w-full" />
                  </div>
                )}

                <div className="bg-white/10 h-[28rem] w-0.5 hidden md:block" />

                <div className="w-full h-96 p-8 mt-4  max-w-[20rem] animate-shimmer  rounded-[20px] border border-white/10 bg-[linear-gradient(110deg,#240e30,45%,#813299,55%,#280f35)] bg-[length:200%_100%] font-medium transition-colors">
                  <h6 className="text-xl font-medium">NYU Special</h6>
                  <p className="text-sm opacity-60 mb-8">
                    Unlimited SRSWTI One Access
                  </p>

                  <h3 className="text-4xl font-bold">
                    $0{" "}
                    <span className="text-sm opacity-60 font-normal">
                      / forever
                    </span>
                  </h3>

                  <Button
                    disabled={nyuStudent}
                    onClick={() => {
                      dispatch(setAppStateReducer({ showBilling: false }));
                      setShowNYUSteps(true);
                    }}
                    className="rounded-full mt-4 w-full h-fit py-3.5"
                  >
                    {nyuStudent ? "Current Plan" : "Get Started"}
                  </Button>

                  {/* <small className="block mt-3">This includes:</small> */}
                  <ul className="flex flex-col gap-2.5 mt-2.5">
                    {/* {freeFeatures.map((f, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <div className="bg-slate-600 rounded-full p-0.5">
                            <CheckIcon className="size-3 rouded-full " />{" "}
                          </div>{" "}
                          <span className="text-[12px] text-white">
                            {" "}
                            {f}
                          </span>
                        </li>
                      ))} */}
                  </ul>

                  <div className="w-full" />
                </div>
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BillingDialog;
