/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { UserRole } from "../types";

interface DashboardSkeletonProps {
  role: UserRole;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ role }) => {
  return (
    <div className="space-y-6" id="dashboard-skeleton-root">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="skeleton-kpis">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-4 rounded-2xl border border-gray-200/40 dark:border-gray-800/85 bg-white/50 dark:bg-gray-950/20 backdrop-blur-xs flex items-center gap-3.5 shadow-sm animate-pulse"
          >
            {/* Icon circle skeleton */}
            <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-800 shrink-0" />
            <div className="space-y-2 flex-1">
              {/* Small category text skeleton */}
              <div className="h-2.5 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3" />
              {/* Huge metrics number skeleton */}
              <div className="h-5 bg-gray-300 dark:bg-gray-700 rounded-full w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {/* Main content split panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="skeleton-main-panels">
        {/* Large Widget Left side (e.g. Chart / List) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1 */}
          <div className="p-5 rounded-2xl border border-gray-200/40 dark:border-gray-800/85 bg-white/50 dark:bg-gray-950/20 backdrop-blur-xs space-y-4 shadow-sm animate-pulse">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800/50 pb-3">
              <div className="h-3.5 bg-gray-300 dark:bg-gray-800 rounded-full w-1/4" />
              <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-16" />
            </div>
            
            {/* Main body placeholder (simulates a chart or list) */}
            <div className="h-52 bg-gray-100 dark:bg-gray-900/40 rounded-xl flex items-center justify-center p-4">
              <div className="w-full h-full flex items-end gap-3 justify-around pt-6">
                {[40, 70, 45, 90, 60, 30, 85, 50, 75, 40].map((height, idx) => (
                  <div
                    key={idx}
                    style={{ height: `${height}%` }}
                    className="w-full bg-gray-200 dark:bg-gray-800/60 rounded-t-md"
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="p-5 rounded-2xl border border-gray-200/40 dark:border-gray-800/85 bg-white/50 dark:bg-gray-950/20 backdrop-blur-xs space-y-4 shadow-sm animate-pulse">
            <div className="h-3.5 bg-gray-300 dark:bg-gray-800 rounded-full w-1/5" />
            <div className="space-y-3">
              {[1, 2, 3].map((row) => (
                <div key={row} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-800/20">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800" />
                    <div className="space-y-1.5 flex-1">
                      <div className="h-2.5 bg-gray-300 dark:bg-gray-700 rounded-full w-1/3" />
                      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full w-1/2" />
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full w-12" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Widget Right side */}
        <div className="space-y-6">
          <div className="p-5 rounded-2xl border border-gray-200/40 dark:border-gray-800/85 bg-white/50 dark:bg-gray-950/20 backdrop-blur-xs space-y-5 shadow-sm animate-pulse">
            <div className="h-3.5 bg-gray-300 dark:bg-gray-800 rounded-full w-1/3 mb-2" />
            
            {/* List items */}
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="flex gap-3 items-start">
                  <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800 mt-1.5" />
                  <div className="space-y-2 flex-1">
                    <div className="h-2.5 bg-gray-300 dark:bg-gray-700 rounded-full w-4/5" />
                    <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-gray-200/40 dark:border-gray-800/85 bg-white/50 dark:bg-gray-950/20 backdrop-blur-xs space-y-4 shadow-sm animate-pulse">
            <div className="h-3.5 bg-gray-300 dark:bg-gray-800 rounded-full w-1/2" />
            <div className="h-28 bg-gray-100 dark:bg-gray-900/40 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
};
