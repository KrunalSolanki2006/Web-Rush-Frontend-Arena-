import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { MotionConfig } from 'motion/react';
import { Shell } from './Shell';
import { ErrorBoundary } from './ErrorBoundary';
import { Printer } from 'lucide-react';

const HomePage = lazy(() => import('../features/home/HomePage').then(m => ({ default: m.HomePage })));
const StoryPage = lazy(() => import('../features/story/StoryPage').then(m => ({ default: m.StoryPage })));
const ThreadsPage = lazy(() => import('../features/threads/ThreadsPage').then(m => ({ default: m.ThreadsPage })));
const MapPage = lazy(() => import('../features/map/MapPage').then(m => ({ default: m.MapPage })));
const PatternsPage = lazy(() => import('../features/patterns/PatternsPage').then(m => ({ default: m.PatternsPage })));
const ArchivePage = lazy(() => import('../features/archive/ArchivePage').then(m => ({ default: m.ArchivePage })));
const MethodPage = lazy(() => import('../features/method/MethodPage').then(m => ({ default: m.MethodPage })));
const NotFound = lazy(() => import('../pages/NotFound').then(m => ({ default: m.NotFound })));

const RouteFallback: React.FC = () => (
  <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 font-mono text-xs text-ink-soft" role="status">
    <div className="w-10 h-10 rounded-full bg-paper-deep flex items-center justify-center text-ink animate-pulse">
      <Printer size={20} aria-hidden="true" />
    </div>
    <div className="uppercase tracking-widest text-ink">
      Printing Receipt...
    </div>
  </div>
);

export const AppRouter: React.FC = () => {
  return (
    <MotionConfig reducedMotion="user">
      <ErrorBoundary>
        <BrowserRouter>
          <Shell>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/story" element={<StoryPage />} />
                <Route path="/threads" element={<ThreadsPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/patterns" element={<PatternsPage />} />
                <Route path="/archive" element={<ArchivePage />} />
                <Route path="/method" element={<MethodPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Shell>
        </BrowserRouter>
      </ErrorBoundary>
    </MotionConfig>
  );
};
