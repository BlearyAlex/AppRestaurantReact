import { IconCirclePlusFilled, IconMail } from "@tabler/icons-react"
import { Link, useLocation } from "react-router"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronDown, ChevronRight } from "lucide-react"
import React from "react"
import { AnimatePresence, motion } from "framer-motion"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ComponentType<any>
    items?: { title: string; url: string; icon?: React.ComponentType<any> }[]
  }[]
}) {
  const location = useLocation()
  const [openSubmenu, setOpenSubmenu] = React.useState<string | null>(null)

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create"
              className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
            >
              <IconCirclePlusFilled />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <IconMail />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => {
            const hasSubmenu = item.items && item.items.length > 0
            const isOpen = openSubmenu === item.title
            return (
              <SidebarMenuItem key={item.title}>
                <div className="flex items-center w-full">
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={location.pathname === item.url || (hasSubmenu && item.items?.some(sub => sub.url === location.pathname))}
                    onClick={() => {
                      if (hasSubmenu) {
                        setOpenSubmenu(isOpen ? null : item.title)
                      }
                    }}
                    className="flex-1 justify-start"
                  >
                    <Link to={item.url} tabIndex={hasSubmenu ? -1 : 0} className="flex items-center w-full">
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      {hasSubmenu && (
                        <span className="ml-auto flex items-center px-1">
                          {isOpen ? (
                            <ChevronDown className="size-4" />
                          ) : (
                            <ChevronRight className="size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          )}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </div>
                {hasSubmenu && (
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="submenu"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        style={{ overflow: 'hidden' }}
                      >
                        <SidebarMenuSub>
                          {(item.items ?? []).map((sub) => (
                            <SidebarMenuSubItem key={sub.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={location.pathname === sub.url}
                                size="md"
                              >
                                <Link to={sub.url}>
                                  {sub.icon && <sub.icon />}
                                  <span>{sub.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
