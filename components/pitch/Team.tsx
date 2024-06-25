"use client";

import { picksStore } from "@/app/store";
import { CubeIcon, ResetIcon } from "@radix-ui/react-icons";
import DraftChanges from "../drafts/changes";
import DraftSave from "../drafts/save";
import { Button } from "../ui/button";
import Gameweek from "./Gameweek";

export default function Team() {
  const drafts = picksStore((state) => state.drafts);
  return (
    <div className="w-full min-h-full max-h-screen flex flex-row justify-start gap-5">
      <nav className="flex flex-col justify-center gap-4">
        <div>
          <Button variant="ghost" size="xs" title="Save Draft">
            <ResetIcon />
          </Button>
        </div>
        <div>
          <Button variant="ghost" size="xs" title="Save Draft">
            <CubeIcon />
          </Button>
        </div>
        <div>
          <DraftSave />
        </div>
        <div>
          <DraftChanges />
        </div>
      </nav>
      <div className="flex flex-col flex-grow">
        <div className="flex flex-row gap-1">
          <div className="mt-4">
            {drafts.id && (
              <div className="flex flex-col justify-end">
                <div className="text-xs italic font-light">{drafts.name}</div>
                <div className="text-xs font-black">{drafts.description}</div>
              </div>
            )}
          </div>
        </div>
        <Gameweek />
      </div>
    </div>
  );
}
