/**
 * Playground — vitrine dos componentes de @fiuzakyo/ui-react em todas as marcas e temas.
 * `npm run playground` gera playground/dist/index.html (abra no navegador).
 */
import * as React from "react"
import { createRoot } from "react-dom/client"
import {
  BellRingingIcon,
  CaretDownIcon,
  ChartBarIcon,
  DotsThreeVerticalIcon,
  GaugeIcon,
  LightningIcon,
  PlusIcon,
  SparkleIcon,
  UsersIcon,
} from "@phosphor-icons/react"
import * as UI from "@fiuzakyo/ui-react"
import "@fiuzakyo/ui-react/styles.css"

const {
  Alert, AnnouncementBadge, AttachmentChip, Avatar, AvatarFallback, AvatarGroup, AvatarStatus, Badge, Balance, Breadcrumb,
  BreadcrumbEllipsis, BreadcrumbHome, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
  Button, Calendar, Checkbox, FieldCheckbox, FieldChoiceCard, FieldCounter, FieldDescription, FieldTextInput, FieldTextarea,
  FileUploadDropzone, FileUploadItem, Image, InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputOTP,
  InputOTPGroup, InputOTPSlot, Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle, KeyIcon, Label,
  NotificationItem, NumberInput, PaginationBar, Progress, ProfileCard, PromptInput, PromptSuggestion, Separator,
  Sidebar, SidebarAccount, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuBadge,
  SidebarMenuButton, SidebarMenuItem, SidebarProvider, SidebarUser, StatCard, StatItem, StatusBadge, Switch, Table,
  TableBody, TableCell, TableCellText, TableHead, TableHeader, TableRow, Tabs, TabsContent, TabsCount, TabsList,
  TabsTrigger, Tag, TagInput, VoltronToast,
} = UI

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section style={{ display: "flex", flexDirection: "column", gap: 12, padding: "20px 0", borderTop: "1px solid var(--border)" }}>
      <h2 style={{ font: "600 13px/1.4 var(--vt-font-family-text)", textTransform: "uppercase", letterSpacing: ".06em", color: "var(--muted-foreground)", margin: 0 }}>{title}</h2>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "flex-start" }}>{children}</div>
    </section>
  )
}

function Gallery() {
  const [brand, setBrand] = React.useState(() => new URLSearchParams(location.search).get("brand") ?? "whitelabel")
  const [theme, setTheme] = React.useState(() => new URLSearchParams(location.search).get("theme") ?? "light")
  const [checked, setChecked] = React.useState(true)
  const [tags, setTags] = React.useState(["Design", "Produto"])
  const [page, setPage] = React.useState(1)
  return (
    <div data-brand={brand} data-theme={theme} style={{ background: "var(--background)", color: "var(--foreground)", minHeight: "100vh", fontFamily: "var(--vt-font-family-text)" }}>
      <div style={{ maxWidth: 1180, margin: "0 auto", padding: 32 }}>
        <header style={{ display: "flex", alignItems: "center", gap: 16, paddingBottom: 16 }}>
          <h1 className="" style={{ font: "800 28px/1.3 var(--vt-font-family-display)", margin: 0, flex: 1 }}>Voltron · componentes</h1>
          <select value={brand} onChange={(e) => setBrand(e.target.value)}>
            <option value="whitelabel">Whitelabel</option>
            <option value="detetive-auto">Detetive Auto</option>
            <option value="verax">Verax</option>
          </select>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="light">Claro</option>
            <option value="dark">Escuro</option>
          </select>
        </header>

        <Section title="Button">
          {(["default", "secondary", "outline", "soft", "ghost", "destructive", "link"] as const).map((v) => (
            <Button key={v} variant={v}>{v}</Button>
          ))}
          <Button size="sm"><PlusIcon data-icon="inline-start" />Pequeno</Button>
          <Button size="lg">Grande<CaretDownIcon data-icon="inline-end" /></Button>
          <Button size="icon" aria-label="Adicionar"><PlusIcon /></Button>
          <Button size="icon-xs" variant="outline" aria-label="Adicionar"><PlusIcon /></Button>
          <Button disabled>Desabilitado</Button>
        </Section>

        <Section title="Badge · Tag · Status · Announcement">
          {(["default", "secondary", "destructive", "outline", "ghost", "link", "success", "warning", "info"] as const).map((v) => (
            <Badge key={v} variant={v}>{v}</Badge>
          ))}
          {(["neutral", "brand", "success", "warning", "error"] as const).map((t) => (
            <Tag key={t} tone={t} onRemove={() => {}}>{t}</Tag>
          ))}
          <Tag size="md" tone="brand">Tag md</Tag>
          <StatusBadge status="success" action="Ver novidades" href="#">100+ seções adicionadas</StatusBadge>
          <AnnouncementBadge href="#" tone="brand">39+ atualizações disponíveis</AnnouncementBadge>
          <AnnouncementBadge href="#" type="split">39+ atualizações</AnnouncementBadge>
        </Section>

        <Section title="Avatar · Key Icon">
          {(["xs", "sm", "md", "lg", "xl"] as const).map((s) => (
            <Avatar key={s} size={s}><AvatarFallback>MD</AvatarFallback><AvatarStatus status="online" /></Avatar>
          ))}
          <Avatar size="sm" variant="portrait"><AvatarFallback>MD</AvatarFallback></Avatar>
          <AvatarGroup size="sm" count="+3">
            <Avatar><AvatarFallback>AB</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>CD</AvatarFallback></Avatar>
            <Avatar><AvatarFallback>EF</AvatarFallback></Avatar>
          </AvatarGroup>
          {(["neutral", "brand", "success", "warning", "error"] as const).map((t) => (
            <KeyIcon key={t} tone={t} size="md"><LightningIcon /></KeyIcon>
          ))}
          {(["neutral", "brand", "success", "warning", "error"] as const).map((t) => (
            <KeyIcon key={t} tone={t} variant="solid" size="md"><LightningIcon /></KeyIcon>
          ))}
        </Section>

        <Section title="Controles">
          <Checkbox checked={checked} onCheckedChange={(v) => setChecked(!!v)} />
          <Checkbox checked="indeterminate" />
          <Checkbox aria-invalid />
          <Switch defaultChecked />
          <Switch size="default" icons />
          <div style={{ width: 240 }}><Progress value={60} label="Enviando arquivo.pdf" /></div>
          <div style={{ width: 160 }}><Progress value={40} tone="success" size="md" /></div>
          <Label required info>Label</Label>
          <FieldDescription icon>Texto de apoio do campo.</FieldDescription>
          <FieldDescription tone="error" icon>Verifique este campo.</FieldDescription>
          <FieldCounter value={182} max={200} />
        </Section>

        <Section title="Campos">
          <div style={{ width: 320 }}><FieldTextInput label="Nome completo" hint="Como aparece no documento." /></div>
          <div style={{ width: 320 }}><FieldTextInput label="E-mail" defaultValue="maria@" error="Informe um e-mail válido." /></div>
          <div style={{ width: 320 }}><FieldTextInput label="Valor" prefix="R$" end={<CaretDownIcon />} size="sm" /></div>
          <div style={{ width: 300 }}>
            <InputGroup>
              <InputGroupAddon><SparkleIcon /></InputGroupAddon>
              <InputGroupInput placeholder="Digite um valor…" />
              <InputGroupAddon align="inline-end"><InputGroupButton>Salvar</InputGroupButton></InputGroupAddon>
            </InputGroup>
          </div>
          <div style={{ width: 160 }}><NumberInput defaultValue={12} min={1} max={20} /></div>
          <div style={{ width: 330 }}><TagInput value={tags} onValueChange={setTags} /></div>
          <div style={{ width: 420 }}><FieldTextarea label="Observações" maxLength={200} defaultValue="Cliente pediu revisão do contrato." /></div>
          <InputOTP maxLength={4}><InputOTPGroup>{[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} />)}</InputOTPGroup></InputOTP>
          <div style={{ width: 400 }}><FieldCheckbox label="Receber novidades" sublabel="(opcional)" badge={<Badge>NOVO</Badge>} description="Insira aqui a descrição do checkbox." link={<a href="#">Saiba mais</a>} defaultChecked /></div>
          <div style={{ width: 320 }}><FieldChoiceCard label="Plano Pro" description="Mais recursos para o time." media={<KeyIcon size="md"><LightningIcon /></KeyIcon>} defaultChecked /></div>
        </Section>

        <Section title="Alert · Toast · Upload">
          {(["error", "warning", "success", "information", "feature"] as const).map((s) => (
            <Alert key={s} status={s} title="Insira o título do alerta" action={<a href="#">Saiba mais</a>} onDismiss={() => {}}>Insira a descrição aqui.</Alert>
          ))}
          <VoltronToast status="success" size="small" title="Arquivo enviado" actions={<a href="#">Desfazer</a>} onDismiss={() => {}} />
          <VoltronToast status="feature" size="large" title="Nova funcionalidade" description="Insira a descrição do alerta aqui. Fica melhor com até duas linhas." actions={<><a href="#">Revisar</a><a href="#">Saiba mais</a></>} onDismiss={() => {}} />
          <div style={{ width: 380 }}><FileUploadDropzone required /></div>
          <div style={{ width: 380 }}><FileUploadItem name="relatorio-mensal.pdf" status="uploading" progress={25} onAction={() => {}} /></div>
          <div style={{ width: 380 }}><FileUploadItem name="relatorio-mensal.pdf" status="failed" onAction={() => {}} /></div>
          <AttachmentChip name="documento.pdf" meta="PDF · 940 KB" onRemove={() => {}} />
        </Section>

        <Section title="Navegação">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem><BreadcrumbHome href="#" /></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbLink href="#">Clientes</BreadcrumbLink></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbEllipsis /></BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem><BreadcrumbPage>Histórico</BreadcrumbPage></BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          {(["pills", "pills-elevated", "underline", "folders-highlighted"] as const).map((v) => (
            <Tabs key={v} defaultValue="a">
              <TabsList variant={v}>
                <TabsTrigger value="a">Resumo <TabsCount>12</TabsCount></TabsTrigger>
                <TabsTrigger value="b">Detalhes</TabsTrigger>
                <TabsTrigger value="c" disabled>Histórico</TabsTrigger>
              </TabsList>
              <TabsContent value="a" />
            </Tabs>
          ))}
          <div style={{ width: "100%" }}><PaginationBar page={page} total={2077} pageSize={10} onPageChange={setPage} /></div>
        </Section>

        <Section title="Tabela">
          <div style={{ width: "100%", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <Table>
              <TableHeader><TableRow><TableHead><Checkbox aria-label="Todas" /></TableHead><TableHead divider>Cliente</TableHead><TableHead divider>Item</TableHead><TableHead>Status</TableHead><TableHead /></TableRow></TableHeader>
              <TableBody striped>
                {["Duarte, Marina", "Souza, Rafael", "Lima, Ana"].map((n, i) => (
                  <TableRow key={n} data-state={i === 1 ? "selected" : undefined}>
                    <TableCell><Checkbox aria-label={n} checked={i === 1} /></TableCell>
                    <TableCell><div style={{ display: "flex", gap: 12, alignItems: "center" }}><Avatar size="sm"><AvatarFallback>{n.slice(0, 2)}</AvatarFallback></Avatar><TableCellText description="Rua XV de Novembro, 1200">{n}</TableCellText></div></TableCell>
                    <TableCell><TableCellText description="Cobrança mensal">Plano Essencial</TableCellText></TableCell>
                    <TableCell><Tag tone="success">Confirmado</Tag></TableCell>
                    <TableCell><Button variant="ghost" size="icon-sm" aria-label="Menu"><DotsThreeVerticalIcon /></Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Section>

        <Section title="Cards · Item · Notificações · IA">
          <StatCard label="Receita do mês" value="R$ 48.210" delta="+12% desde ontem" trend="up" href="#" style={{ width: 300 }} />
          <ProfileCard name="Nome Sobrenome" bio="Descrição curta da pessoa ou da conta, com no máximo duas linhas." stats={<><StatItem icon={<UsersIcon />} value={312} /><StatItem icon={<ChartBarIcon />} value={48} /></>} following={false} />
          <ProfileCard layout="horizontal" name="Nome Sobrenome" bio="Descrição curta." following loading />
          <div style={{ width: 320, display: "flex", flexDirection: "column", gap: 8 }}>
            <Item><ItemMedia><Avatar size="sm"><AvatarFallback>MD</AvatarFallback></Avatar></ItemMedia><ItemContent><ItemTitle>Título do item</ItemTitle><ItemDescription>Descrição do item</ItemDescription></ItemContent><ItemActions><Button variant="outline" size="icon-sm" aria-label="Adicionar"><PlusIcon /></Button></ItemActions></Item>
            <Item variant="dashed"><Button variant="outline" size="icon-sm" aria-label="Adicionar"><PlusIcon /></Button></Item>
          </div>
          <div style={{ width: 408 }}>
            <NotificationItem type="comment" unread avatar={<Avatar><AvatarFallback>MS</AvatarFallback></Avatar>} actor="@mariana.souza" message="comentou no seu documento" comment="Ótimo trabalho no relatório!" date="Quinta, 14:44" time="há 4 horas" />
            <NotificationItem type="invite" avatar={<Avatar><AvatarFallback>RS</AvatarFallback></Avatar>} actor="@rafael" message="convidou você para" target="Workspace Exemplo" date="Quinta, 14:44" time="há 4 horas" />
          </div>
          <div style={{ width: 720 }}>
            <PromptInput suggestions={<><PromptSuggestion>Resumir este documento</PromptSuggestion><PromptSuggestion>Criar um plano</PromptSuggestion></>} onAttach={() => {}} />
          </div>
          <Calendar mode="single" selected={new Date()} />
        </Section>

        <Section title="Sidebar">
          <div style={{ height: 520, display: "flex", border: "1px solid var(--border)", borderRadius: 14, overflow: "hidden" }}>
            <SidebarProvider style={{ minHeight: 0 }}>
              <Sidebar style={{ height: 520, position: "relative" }}>
                <SidebarAccount avatar={<Avatar><AvatarFallback>EE</AvatarFallback></Avatar>} name="Empresa Exemplo" description="Plano Pro · 12 usuários" />
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupLabel>Geral</SidebarGroupLabel>
                    <SidebarMenu>
                      <SidebarMenuItem><SidebarMenuButton isActive tooltip="Painel"><GaugeIcon weight="fill" /><span>Painel</span></SidebarMenuButton></SidebarMenuItem>
                      <SidebarMenuItem><SidebarMenuButton tooltip="Notificações"><BellRingingIcon /><span>Notificações</span><SidebarMenuBadge>3</SidebarMenuBadge></SidebarMenuButton></SidebarMenuItem>
                    </SidebarMenu>
                  </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                  <Balance value="R$ 64" onAdd={() => {}} />
                  <SidebarUser avatar={<Avatar><AvatarFallback>UE</AvatarFallback></Avatar>} name="Usuário Exemplo" email="usuario@exemplo.com" />
                </SidebarFooter>
              </Sidebar>
            </SidebarProvider>
          </div>
          <Separator orientation="vertical" />
          <Image ratio="4:3" style={{ width: 240 }} />
        </Section>
      </div>
    </div>
  )
}

createRoot(document.getElementById("root")!).render(<Gallery />)
