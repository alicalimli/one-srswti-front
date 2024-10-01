import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { useAppSelector } from "@/lib/hooks/use-redux";
import { getUserState } from "@/lib/redux/slices/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile } from "@/lib/redux/action/actions-user";
import { MultiSelect } from "@/components/ui/multi-select";
import { USER_INTERESTS } from "@/lib/data/interests";
import { MultiSelectType } from "@/lib/types";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LANGUAGES } from "@/lib/data/languages";
import { NYU_SCHOOLS } from "@/lib/data/nyuSchools";
import { NYU_MAJORS } from "@/lib/data/dataMajors";

const MemoizedSelectContent = React.memo(SelectContent);
const MemoizedMultiSelect = React.memo(MultiSelect);
const MemoizedSelectItem = React.memo(SelectItem);

const Profile = () => {
  const dispatch = useDispatch();
  const { nyuStudent, profile } = useAppSelector(getUserState);

  const [formData, setFormData] = useState({
    firstName: "",
    interests: [] as MultiSelectType[],
    lastName: "",
    age: "",
    preferredLanguage: "",
    school: "",
    description: "",
    course: "",
  });

  const [isEdited, setIsEdited] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        preferredLanguage: profile.preferredLanguage?.code || "",
        course: profile.course || "",
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        age: profile.age?.toString() || "",
        school: profile.school || "",
        description: profile.description || "",
        interests: profile.interests || [],
      });
    }
  }, [profile]);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
      setIsEdited(true);
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setIsEdited(false);

    try {
      const lang = LANGUAGES.find(
        (l) => l.code === formData.preferredLanguage
      ) || {
        code: "",
        name: "",
      };

      await dispatch(
        updateUserProfile({
          ...formData,
          age: parseInt(formData.age),
          preferredLanguage: lang,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setIsEdited(true);
  }, []);

  const handleInterestsChange = useCallback((newData: MultiSelectType[]) => {
    setFormData((prev) => ({ ...prev, interests: newData }));
    setIsEdited(true);
  }, []);

  const memoizedLanguages = useMemo(() => LANGUAGES, []);
  const memoizedNyuSchools = useMemo(() => NYU_SCHOOLS, []);
  const memoizedNyuMajors = useMemo(() => NYU_MAJORS, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Profile</h3>
        <p className="text-sm text-muted-foreground">
          Provide personal details for tailored AI responses and guidance.
        </p>
      </div>
      <Separator />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-x-4 flex items-center">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </label>
            <Input
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="bg-secondary"
              placeholder="e.g. John"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </label>
            <Input
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="bg-secondary"
              placeholder="e.g. Doe"
            />
          </div>
        </div>

        <div className="space-x-4 flex items-center">
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="age" className="text-sm font-medium">
              Age
            </label>
            <Input
              id="age"
              name="age"
              type="number"
              value={formData.age}
              onChange={handleInputChange}
              className="bg-secondary"
              placeholder="e.g. 25"
            />
          </div>
          <div className="flex flex-col gap-2 w-full">
            <label htmlFor="preferredLanguage" className="text-sm font-medium">
              Preferred Language
            </label>
            <Select
              value={formData.preferredLanguage}
              onValueChange={(val) =>
                handleSelectChange("preferredLanguage", val)
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Preferred Language" />
              </SelectTrigger>
              <MemoizedSelectContent>
                <SelectGroup>
                  <SelectLabel>Languages</SelectLabel>
                  {memoizedLanguages.map((l) => (
                    <MemoizedSelectItem key={l.code} value={l.code}>
                      {l.name}
                    </MemoizedSelectItem>
                  ))}
                </SelectGroup>
              </MemoizedSelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <label htmlFor="interests" className="text-sm font-medium">
            What are your interests?
          </label>
          <MemoizedMultiSelect
            placeholder="Interests"
            initialSelections={formData.interests}
            setSelection={handleInterestsChange}
            data={USER_INTERESTS}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="school" className="text-sm font-medium">
            What school are you currently attending?
          </label>

          {nyuStudent ? (
            <Select
              value={formData.school}
              onValueChange={(val) => handleSelectChange("school", val)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="School" />
              </SelectTrigger>
              <MemoizedSelectContent>
                <SelectGroup>
                  <SelectLabel>Schools</SelectLabel>
                  {memoizedNyuSchools.map((school) => (
                    <MemoizedSelectItem key={school.id} value={school.name}>
                      {school.name}
                    </MemoizedSelectItem>
                  ))}
                </SelectGroup>
              </MemoizedSelectContent>
            </Select>
          ) : (
            <Input
              id="school"
              name="school"
              value={formData.school}
              onChange={handleInputChange}
              className="bg-secondary"
              placeholder="e.g. University of California, Berkeley"
            />
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="course" className="text-sm font-medium">
            Which major are you pursuing?
          </label>

          <Select
            value={formData.course}
            onValueChange={(val) => handleSelectChange("course", val)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Major" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Majors</SelectLabel>
                {memoizedNyuMajors.map((major) => (
                  <SelectItem key={major.id} value={major.name}>
                    {major.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="description" className="text-sm font-medium">
            Tell SRSWTI about yourself
          </label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="bg-secondary h-44 scrollbar-hide"
            rows={3}
            placeholder="Tell us about yourself, your background, and your goals..."
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !isEdited}
          className="text-sm fixed bottom-4 md:bottom-8 md:right-24"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </form>
    </div>
  );
};

export default React.memo(Profile);
