import { ContentType } from "@/types"
import { FC } from "react"
import { TabsTrigger } from "../ui/tabs"
import { WithTooltip } from "../ui/with-tooltip"

interface SidebarSwitchItemProps {
  contentType: ContentType
  icon: React.ReactNode
  onContentTypeChange: (contentType: ContentType) => void
}

export const SidebarSwitchItem: FC<SidebarSwitchItemProps> = ({
  contentType,
  icon,
  onContentTypeChange
}) => {
  return (
    <WithTooltip
      display={
        <div>{contentType[0].toUpperCase() + contentType.substring(1)}</div>
      }
      trigger={
        <TabsTrigger
          className="hover:opacity-50 data-[state=active]:outline data-[state=active]:outline-2 data-[state=active]:outline-primary data-[state=active]:outline-offset-2"
          value={contentType}
          onClick={() => onContentTypeChange(contentType as ContentType)}
        >
          {icon}
        </TabsTrigger>
      }
    />
  )
}
