import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatFadeEnter } from "@/components/ui/chat-fade-enter";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { useAppDispatch } from "@/lib/hooks/use-redux";
import { reduxSendQuery } from "@/lib/redux/action/actions-send-query";
import { ThreadMessageGroupType } from "@/lib/types";
import { ArrowRight, Check, FastForward, Sparkles } from "lucide-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface InquiryType {
  question: string;
  userQuery: string;
  completed?: boolean;
  skipped?: boolean;
  choices: string[];
  allowsInput?: boolean;
  inputLabel?: string;
  checkedOptions?: { [key: string]: boolean };
  inputPlaceholder?: string;
}

export type CopilotProps = {
  id: string;
  inquiry: InquiryType;
};

export const Copilot: React.FC<CopilotProps> = ({
  id,
  inquiry,
}: CopilotProps) => {
  const [completed, setCompleted] = useState(inquiry.completed || false);
  const [query, setQuery] = useState("");
  const [skipped, setSkipped] = useState(inquiry.skipped || false);
  const [checkedOptions, setCheckedOptions] = useState<{
    [key: string]: boolean;
  }>(inquiry?.checkedOptions || {});

  const error = "";
  const dispatch = useAppDispatch();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleOptionChange = (selectedOption: string) => {
    const updatedCheckedOptions = {
      ...checkedOptions,
      [selectedOption]: !checkedOptions[selectedOption],
    };
    setCheckedOptions(updatedCheckedOptions);
  };

  const updatedQuery = () => {
    const selectedOptions = Object.entries(checkedOptions)
      .filter(([, checked]) => checked)
      .map(([option]) => option);
    return [...selectedOptions, query].filter(Boolean).join(", ");
  };

  const parseFormData = (formData: {
    selectedOptions: string[];
    additionalQuery: string;
    skip: boolean;
  }) => {
    const { selectedOptions, additionalQuery } = formData;
    const optionsString = selectedOptions.join(", ");
    return additionalQuery
      ? `${optionsString} and ${additionalQuery}`
      : optionsString;
  };

  const onFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
    skip?: boolean
  ) => {
    e.preventDefault();

    const formData = {
      selectedOptions: Object.entries(checkedOptions)
        .filter(([, checked]) => checked)
        .map(([option]) => option),
      additionalQuery: query,
      skip: skip || false,
    };

    if (formData.skip) {
      dispatch(
        reduxSendQuery({
          skipInquire: true,
          query: inquiry.userQuery,
          messages: [],
          updateInquiries: [{ id: id, data: { ...inquiry, skipped: true } }],
        })
      );

      setSkipped(true);
    } else {
      setCompleted(true);

      const groupChat: ThreadMessageGroupType = {
        query: "",
        id: uuidv4(),
        transformed_query: "",
        messages: [
          { role: "assistant", content: inquiry.question },
          { role: "user", content: parseFormData(formData) },
        ],
      };

      dispatch(
        reduxSendQuery({
          skipInquire: formData.skip,
          query: inquiry.userQuery,
          messages: [groupChat],
          updateInquiries: [{ id: id, data: { ...inquiry, checkedOptions } }],
        })
      );
    }

    // Add your form submission logic here
  };

  const handleSkip = (e: React.MouseEvent<HTMLButtonElement>) => {
    onFormSubmit(e as unknown as React.FormEvent<HTMLFormElement>, true);
  };

  return (
    <ChatFadeEnter>
      {error ? (
        <Card className="p-4 w-full flex rounded-[12px] justify-between items-center bg-primary/20 border border-white/20">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4" />
            <h5 className="text-white/80 text-xs truncate">
              {`error: ${error}`}
            </h5>
          </div>
        </Card>
      ) : skipped || completed ? (
        <Card className="p-3 md:p-4 w-full flex rounded-[12px] justify-between items-center bg-primary/20 border border-white/20">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <h5 className="text-white/80 text-xs truncate">
              {skipped ? "skipped" : updatedQuery()}
            </h5>
          </div>
          <Check size={16} className="text-green-500 w-4 h-4" />
        </Card>
      ) : (
        <Card className="rounded-[16px] w-full mx-auto bg-primary/20 border border-white/20 p-6">
          <div className="mb-4">
            <p className="text-lg text-white/80 text-semibold ml-2">
              {inquiry?.question}
            </p>
          </div>
          <form onSubmit={onFormSubmit}>
            <div className="flex flex-wrap justify-start ">
              {inquiry?.choices?.map((option, index) => (
                <div
                  key={`option-${index}`}
                  className="flex items-center space-x-1.5 mb-2"
                >
                  <Checkbox
                    id={option}
                    name={option}
                    onCheckedChange={() => handleOptionChange(option)}
                  />
                  <label
                    className="text-sm whitespace-nowrap pr-4"
                    htmlFor={option}
                  >
                    {option}
                  </label>
                </div>
              ))}
            </div>
            {inquiry?.allowsInput && (
              <div className="mb-4 flex flex-col space-y-2 text-sm">
                <label className="text-white/80" htmlFor="query">
                  {inquiry?.choices?.length ? inquiry?.inputLabel : <></>}
                </label>
                <Input
                  type="text"
                  name="additional_query"
                  className="w-full bg-primary/50 border-white/20 rounded-[12px] outline-none "
                  id="query"
                  placeholder={inquiry?.inputPlaceholder}
                  value={query}
                  onChange={handleInputChange}
                />
              </div>
            )}
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={handleSkip}>
                <FastForward size={16} className="mr-1" />
                Skip
              </Button>
              <Button type="submit" disabled={false}>
                <ArrowRight size={16} className="mr-1" />
                Send
              </Button>
            </div>
          </form>
        </Card>
      )}
    </ChatFadeEnter>
  );
};
