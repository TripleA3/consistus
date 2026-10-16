/**
 * The Fannero component kit. Screens import from here; nothing in a
 * screen should reach for a raw colour, radius or shadow.
 *
 * `src/components/ui` is the previous design's set, kept only until the
 * screens that import it are rebuilt — see docs/decisions.md.
 */
export { Button, ButtonLink, buttonClasses } from "@/components/kit/Button";
export type { ButtonVariant, ButtonSize } from "@/components/kit/Button";
export { Card } from "@/components/kit/Card";
export { Chip, ChipRow } from "@/components/kit/Chip";
export { CoverPlaceholder } from "@/components/kit/CoverPlaceholder";
export { BrandLogo } from "@/components/kit/BrandLogo";
export { DropdownMenu } from "@/components/kit/DropdownMenu";
export type { MenuItem } from "@/components/kit/DropdownMenu";
export { EmptyState } from "@/components/kit/EmptyState";
export { Field } from "@/components/kit/Field";
export { Input, Textarea, Select, DateInput } from "@/components/kit/Input";
export { PageHeader } from "@/components/kit/PageHeader";
export { ProgressBar } from "@/components/kit/ProgressBar";
export { Section } from "@/components/kit/Section";
export { Segmented } from "@/components/kit/Segmented";
export { StatTile } from "@/components/kit/StatTile";
export { StatusPill } from "@/components/kit/StatusPill";
export type { StatusTone } from "@/components/kit/StatusPill";
export { Stepper } from "@/components/kit/Stepper";
export { Switch } from "@/components/kit/Switch";
export { Tabs, TabPanel } from "@/components/kit/Tabs";
export type { TabDef } from "@/components/kit/Tabs";
