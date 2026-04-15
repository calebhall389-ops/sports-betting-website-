'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { SPORTSBOOKS, SPORTS } from '@/lib/mock-data';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, DollarSign, Bell, Database, Shield, Save, CircleCheck as CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SettingsData {
  bankroll: string;
  defaultStake: string;
  defaultSportsbook: string;
  defaultSport: string;
  stakeType: string;
  kellyFraction: string;
  alertsEnabled: boolean;
  evAlertThreshold: string;
  lineMovementAlerts: boolean;
  sharpActionAlerts: boolean;
  notificationsEnabled: boolean;
}

const DEFAULT_SETTINGS: SettingsData = {
  bankroll: '10000',
  defaultStake: '100',
  defaultSportsbook: 'DraftKings',
  defaultSport: 'NFL',
  stakeType: 'flat',
  kellyFraction: '25',
  alertsEnabled: true,
  evAlertThreshold: '3',
  lineMovementAlerts: true,
  sharpActionAlerts: true,
  notificationsEnabled: true,
};

function SettingsSection({ title, icon: Icon, children }: { title: string; icon: React.ComponentType<any>; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <div className="flex items-center gap-2 pb-2 border-b border-border/50">
        <Icon className="w-4 h-4 text-blue-400" />
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground font-medium">{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const { data } = await supabase.from('settings').select('key, value');
    if (data && data.length > 0) {
      const map = Object.fromEntries(data.map((d: { key: string; value: string }) => [d.key, d.value]));
      setSettings((prev) => ({
        ...prev,
        ...{
          bankroll: map.bankroll || prev.bankroll,
          defaultStake: map.defaultStake || prev.defaultStake,
          defaultSportsbook: map.defaultSportsbook || prev.defaultSportsbook,
          defaultSport: map.defaultSport || prev.defaultSport,
          stakeType: map.stakeType || prev.stakeType,
          kellyFraction: map.kellyFraction || prev.kellyFraction,
          alertsEnabled: map.alertsEnabled === 'true',
          evAlertThreshold: map.evAlertThreshold || prev.evAlertThreshold,
          lineMovementAlerts: map.lineMovementAlerts !== 'false',
          sharpActionAlerts: map.sharpActionAlerts !== 'false',
          notificationsEnabled: map.notificationsEnabled !== 'false',
        },
      }));
    }
  }

  async function handleSave() {
    setSaving(true);
    const entries = Object.entries(settings).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    for (const entry of entries) {
      await supabase
        .from('settings')
        .upsert({ key: entry.key, value: entry.value }, { onConflict: 'key' });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  function update<K extends keyof SettingsData>(key: K, value: SettingsData[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  const currentBankroll = parseFloat(settings.bankroll) || 0;
  const defaultStakeNum = parseFloat(settings.defaultStake) || 0;
  const stakeAsPct = currentBankroll > 0 ? ((defaultStakeNum / currentBankroll) * 100).toFixed(1) : '0';

  return (
    <div className="max-w-2xl space-y-5">
      <SettingsSection title="Bankroll Management" icon={DollarSign}>
        <SettingRow label="Total Bankroll" description="Your total betting bankroll">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              type="number"
              value={settings.bankroll}
              onChange={(e) => update('bankroll', e.target.value)}
              className="w-32 pl-7 bg-secondary border-border font-mono h-9 text-sm"
            />
          </div>
        </SettingRow>

        <SettingRow label="Default Stake" description={`${stakeAsPct}% of bankroll`}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
            <Input
              type="number"
              value={settings.defaultStake}
              onChange={(e) => update('defaultStake', e.target.value)}
              className="w-32 pl-7 bg-secondary border-border font-mono h-9 text-sm"
            />
          </div>
        </SettingRow>

        <SettingRow label="Staking Strategy" description="How bet sizes are calculated">
          <Select value={settings.stakeType} onValueChange={(v) => update('stakeType', v)}>
            <SelectTrigger className="w-40 h-9 bg-secondary border-border text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="flat">Flat Betting</SelectItem>
              <SelectItem value="kelly">Kelly Criterion</SelectItem>
              <SelectItem value="fractional">Fractional Kelly</SelectItem>
              <SelectItem value="percent">% of Bankroll</SelectItem>
            </SelectContent>
          </Select>
        </SettingRow>

        {settings.stakeType === 'fractional' && (
          <SettingRow label="Kelly Fraction %" description="What fraction of full Kelly to use">
            <Input
              type="number"
              value={settings.kellyFraction}
              onChange={(e) => update('kellyFraction', e.target.value)}
              min="1"
              max="100"
              className="w-24 bg-secondary border-border font-mono h-9 text-sm"
            />
          </SettingRow>
        )}
      </SettingsSection>

      <SettingsSection title="Default Preferences" icon={Settings}>
        <SettingRow label="Default Sportsbook">
          <Select value={settings.defaultSportsbook} onValueChange={(v) => update('defaultSportsbook', v)}>
            <SelectTrigger className="w-40 h-9 bg-secondary border-border text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {SPORTSBOOKS.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
            </SelectContent>
          </Select>
        </SettingRow>

        <SettingRow label="Default Sport">
          <Select value={settings.defaultSport} onValueChange={(v) => update('defaultSport', v)}>
            <SelectTrigger className="w-40 h-9 bg-secondary border-border text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              {SPORTS.map((s) => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </SettingRow>
      </SettingsSection>

      <SettingsSection title="Alerts & Notifications" icon={Bell}>
        <SettingRow label="Enable Alerts" description="Show EV opportunities and line movements">
          <Switch
            checked={settings.alertsEnabled}
            onCheckedChange={(v) => update('alertsEnabled', v)}
          />
        </SettingRow>

        {settings.alertsEnabled && (
          <>
            <SettingRow label="Min EV Threshold" description="Only alert for bets above this EV%">
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  value={settings.evAlertThreshold}
                  onChange={(e) => update('evAlertThreshold', e.target.value)}
                  className="w-20 bg-secondary border-border font-mono h-9 text-sm text-center"
                />
                <span className="text-sm text-muted-foreground">%</span>
              </div>
            </SettingRow>

            <SettingRow label="Line Movement Alerts" description="Notify on significant line moves">
              <Switch
                checked={settings.lineMovementAlerts}
                onCheckedChange={(v) => update('lineMovementAlerts', v)}
              />
            </SettingRow>

            <SettingRow label="Sharp Action Alerts" description="Notify on reverse line movement">
              <Switch
                checked={settings.sharpActionAlerts}
                onCheckedChange={(v) => update('sharpActionAlerts', v)}
              />
            </SettingRow>
          </>
        )}

        <SettingRow label="Browser Notifications" description="Enable desktop notifications">
          <Switch
            checked={settings.notificationsEnabled}
            onCheckedChange={(v) => update('notificationsEnabled', v)}
          />
        </SettingRow>
      </SettingsSection>

      <SettingsSection title="Data & Integrations" icon={Database}>
        <div className="space-y-3">
          {[
            { name: 'Supabase Database', status: 'connected', color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
            { name: 'Odds API', status: 'mock data', color: 'text-amber-400', bg: 'bg-amber-500/15' },
            { name: 'Model API', status: 'mock data', color: 'text-amber-400', bg: 'bg-amber-500/15' },
            { name: 'Results API', status: 'not connected', color: 'text-muted-foreground', bg: 'bg-muted' },
          ].map(({ name, status, color, bg }) => (
            <div key={name} className="flex items-center justify-between py-2">
              <span className="text-sm text-foreground">{name}</span>
              <span className={cn('text-xs font-semibold px-2 py-0.5 rounded', bg, color)}>
                {status}
              </span>
            </div>
          ))}
        </div>
        <div className="pt-2 border-t border-border/50">
          <p className="text-xs text-muted-foreground">
            To connect real odds and predictions APIs, update the environment variables and API routes in <code className="font-mono text-blue-400">/app/api/</code>.
          </p>
        </div>
      </SettingsSection>

      <div className="flex items-center gap-3 pt-2">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="h-10 px-6 bg-blue-500 hover:bg-blue-600 text-white font-semibold gap-2"
        >
          {saved ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Settings'}
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => setSettings(DEFAULT_SETTINGS)}
          className="h-10 border-border text-muted-foreground hover:text-foreground"
        >
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
