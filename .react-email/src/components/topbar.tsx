import * as React from "react";
import classnames from "classnames";
import { Heading } from "./heading";
import { Send } from "./send";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { AnimateSharedLayout, motion } from "framer-motion";

type TopbarElement = React.ElementRef<"header">;
type RootProps = React.ComponentPropsWithoutRef<"header">;

interface TopbarProps extends RootProps {
  title: string;
  viewMode?: string;
  markup?: string;
  setViewMode?: (viewMode: string) => void;
}

export const Topbar = React.forwardRef<TopbarElement, Readonly<TopbarProps>>(
  (
    { className, title, markup, viewMode, setViewMode, ...props },
    forwardedRef,
  ) => {
    const [hovered, setHovered] = React.useState("");
    const columnWidth = "w-[200px]";

    return (
      <header
        ref={forwardedRef}
        className={classnames(
          "border-slate-6 relative flex h-[70px] items-center justify-between border-b bg-black px-6",
          className,
        )}
        {...props}
      >
        <div className={`flex items-center overflow-hidden ${columnWidth}`}>
          <Heading as="h2" size="2" weight="medium" className="truncate">
            {title}
          </Heading>
        </div>

        <div className={`${columnWidth}`}>
          <AnimateSharedLayout>
            {setViewMode && (
              <ToggleGroup.Root
                className="bg-slate-2 border-slate-6 inline-block items-center overflow-hidden rounded-md border"
                type="single"
                value={viewMode}
                aria-label="View mode"
                onValueChange={(value) => {
                  if (!value) {
                    return setViewMode("desktop");
                  }
                  setViewMode(value);
                }}
              >
                <ToggleGroup.Item value="desktop">
                  <motion.div
                    className={classnames(
                      "text-slate-11 relative px-3 py-2 text-sm font-medium transition duration-200 ease-in-out",
                      {
                        "text-slate-12": viewMode === "desktop",
                      },
                    )}
                    onHoverStart={() => setHovered("desktop")}
                    onHoverEnd={() => setHovered("")}
                  >
                    {hovered === "desktop" && (
                      <motion.span
                        layoutId="nav"
                        className="bg-slate-4 absolute left-0 right-0 top-0 bottom-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    Desktop
                  </motion.div>
                </ToggleGroup.Item>
                <ToggleGroup.Item value="source">
                  <motion.div
                    className={classnames(
                      "text-slate-11 relative px-3 py-2 text-sm font-medium transition duration-200 ease-in-out",
                      {
                        "text-slate-12": viewMode === "source",
                      },
                    )}
                    onHoverStart={() => setHovered("source")}
                    onHoverEnd={() => setHovered("")}
                  >
                    {hovered === "source" && (
                      <motion.span
                        layoutId="nav"
                        className="bg-slate-4 absolute left-0 right-0 top-0 bottom-0"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                    Source
                  </motion.div>
                </ToggleGroup.Item>
              </ToggleGroup.Root>
            )}
          </AnimateSharedLayout>
        </div>

        {markup && (
          <div className={`flex justify-end ${columnWidth}`}>
            <Send markup={markup} />
          </div>
        )}
      </header>
    );
  },
);

Topbar.displayName = "Topbar";
