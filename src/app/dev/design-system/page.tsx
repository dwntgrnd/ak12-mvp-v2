'use client';

import Script from 'next/script';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ColorsTab } from './_components/colors-tab';
import { TypographyTab } from './_components/typography-tab';
import { ButtonsTab } from './_components/buttons-tab';
import { SurfacesTab } from './_components/surfaces-tab';
import { SpacingTab } from './_components/spacing-tab';
import { ComponentsTab } from './_components/components-tab';

const tabs = [
  { value: 'colors', label: 'Colors' },
  { value: 'typography', label: 'Typography' },
  { value: 'buttons', label: 'Buttons' },
  { value: 'surfaces', label: 'Surfaces' },
  { value: 'spacing', label: 'Spacing' },
  { value: 'components', label: 'Components' },
];

export default function DesignSystemPage() {
  return (
    <>
      <Script
        src="https://mcp.figma.com/mcp/html-to-design/capture.js"
        strategy="afterInteractive"
      />
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-topbar text-sidebar-foreground">
          <div className="max-w-5xl mx-auto px-6 py-5">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-sidebar-active" />
              <h1 className="text-2xl font-bold tracking-tight">AK12 Design System</h1>
            </div>
            <p className="text-sm mt-1 opacity-70">
              Living style guide — token inventory, component reference, Figma capture source
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-5xl mx-auto px-6 py-8">
          <Tabs defaultValue="colors">
            <TabsList className="mb-6">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="colors">
              <ColorsTab />
            </TabsContent>
            <TabsContent value="typography">
              <TypographyTab />
            </TabsContent>
            <TabsContent value="buttons">
              <ButtonsTab />
            </TabsContent>
            <TabsContent value="surfaces">
              <SurfacesTab />
            </TabsContent>
            <TabsContent value="spacing">
              <SpacingTab />
            </TabsContent>
            <TabsContent value="components">
              <ComponentsTab />
            </TabsContent>
          </Tabs>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-border-default">
            <div className="flex items-center justify-between text-xs text-foreground-tertiary">
              <div>
                6 tabs · ~50 tokens · Source: <code className="font-mono">globals.css</code> + <code className="font-mono">design-tokens.ts</code>
              </div>
              <div>
                Dev only · <code className="font-mono">/dev/design-system</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
