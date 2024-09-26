import { Separator } from '@/components/ui/separator'
import { useState } from 'react'
import Profile from './settings-profile'
import { SidebarNav } from './setting-sidebar'
import AccountSettings from './settings-account'

export default function AppSettings() {
  const [tab, setTab] = useState('Profile')

  const sidebarNavItems = [
    {
      title: 'Profile',
      component: () => <Profile />
    },
    {
      title: 'Account',
      component: () => <AccountSettings />
    }
  ]

  return (
    <div className="space-y-6 ">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and profile.
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-32 overflow-x-auto">
          <SidebarNav tab={tab} setTab={setTab} items={sidebarNavItems} />
        </aside>
        <div className="flex-1 md:pr-8 overflow-y-auto scrollbar-hide  h-[100svh] max-h-[35rem] md:max-h-[40rem] ">
          <div className="px-4 ">
            {sidebarNavItems.map(item => {
              const Component = item.component // Corrected key reference
              return <>{item.title === tab ? <Component /> : null}</>
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
