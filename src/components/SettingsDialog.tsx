import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ColorPicker } from './ColorPicker';
import { CATEGORIES, CategoryType } from '@/types/task';
import { CustomColors } from '@/hooks/useCustomColors';
import { RotateCcw, Bell, BellOff } from 'lucide-react';

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  colors: CustomColors;
  onColorChange: (category: CategoryType, color: string) => void;
  onResetColors: () => void;
  notificationsEnabled: boolean;
  onEnableNotifications: () => void;
}

export const SettingsDialog = ({
  open,
  onOpenChange,
  colors,
  onColorChange,
  onResetColors,
  notificationsEnabled,
  onEnableNotifications,
}: SettingsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-serif text-xl">Settings</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Notifications */}
          <div className="space-y-3">
            <h3 className="font-medium text-sm">Notifications</h3>
            <Button
              variant={notificationsEnabled ? 'secondary' : 'default'}
              className="w-full gap-2"
              onClick={onEnableNotifications}
            >
              {notificationsEnabled ? (
                <>
                  <Bell className="w-4 h-4" />
                  Notifications Enabled
                </>
              ) : (
                <>
                  <BellOff className="w-4 h-4" />
                  Enable Notifications
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Get reminded 5 minutes before tasks start
            </p>
          </div>

          {/* Category Colors */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-sm">Category Colors</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={onResetColors}
                className="gap-1 text-xs"
              >
                <RotateCcw className="w-3 h-3" />
                Reset
              </Button>
            </div>
            <div className="grid gap-2">
              {CATEGORIES.map((cat) => (
                <ColorPicker
                  key={cat.id}
                  label={cat.name}
                  color={colors[cat.id]}
                  onChange={(color) => onColorChange(cat.id, color)}
                />
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
