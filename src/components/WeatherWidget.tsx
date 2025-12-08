import { useWeather } from '@/hooks/useWeather';
import { MapPin, Droplets, Wind } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export const WeatherWidget = () => {
  const { weather, loading, error } = useWeather();

  if (loading) {
    return (
      <div className="widget-card animate-pulse">
        <Skeleton className="h-12 w-24 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="widget-card">
        <p className="text-muted-foreground text-sm">Weather unavailable</p>
      </div>
    );
  }

  return (
    <div className="widget-card">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 text-muted-foreground mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs font-medium">{weather.city}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-light">{weather.temperature}</span>
            <span className="text-xl text-muted-foreground">°F</span>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{weather.condition}</p>
        </div>
        <span className="text-5xl animate-float">{weather.icon}</span>
      </div>

      <div className="flex gap-4 mt-4 pt-4 border-t border-border/50">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Droplets className="w-4 h-4 text-primary/70" />
          <span>{weather.humidity}%</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Wind className="w-4 h-4 text-primary/70" />
          <span>{weather.windSpeed} mph</span>
        </div>
      </div>
    </div>
  );
};
