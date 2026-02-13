'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskGroup from './TaskGroup';
import ExportBox from './ExportBox';
import { createPortal } from 'react-dom';

export default function TaskBoard({
  output,
  specId,
}: {
  output: any;
  specId: string;
}) {
  const [groups, setGroups] = useState<any[]>(output.groups || []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<any>(null);

  // Sync state if output changes (e.g. switching history)
  useEffect(() => {
    if (output?.groups) setGroups(output.groups);
  }, [output]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const groupIds = useMemo(() => groups.map((g) => g.id || g.title), [groups]);

  // Helper to safely get ID from a task (string or object)
  const getTaskId = (task: any) => (typeof task === 'string' ? task : task.id);

  function findGroup(id: string) {
    if (groups.find((g) => (g.id || g.title) === id)) return g;
    // Updated to find task by ID inside object list
    return groups.find((g) => g.tasks.some((t: any) => getTaskId(t) === id));
  }

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    const id = active.id as string;
    setActiveId(id);

    const isGroup = groups.some((g) => (g.id || g.title) === id);
    if (!isGroup) {
      const group = findGroup(id);
      const task = group?.tasks.find((t: any) => getTaskId(t) === id);
      setActiveTask(task);
    }
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeGroup = findGroup(activeId);
    const overGroup = findGroup(overId);

    if (!activeGroup || !overGroup || activeGroup === overGroup) return;

    setGroups((prev) => {
      const activeGroupIndex = prev.findIndex((g) => g.id === activeGroup.id);
      const overGroupIndex = prev.findIndex((g) => g.id === overGroup.id);

      let newActiveTasks = [...prev[activeGroupIndex].tasks];
      let newOverTasks = [...prev[overGroupIndex].tasks];

      const activeTaskIndex = newActiveTasks.findIndex(
        (t) => getTaskId(t) === activeId,
      );
      const overTaskIndex = newOverTasks.findIndex(
        (t) => getTaskId(t) === overId,
      );

      let newIndex;
      if (overTaskIndex >= 0) {
        newIndex = overTaskIndex + (activeId > overId ? 1 : 0);
      } else {
        newIndex = newOverTasks.length + 1;
      }

      // Move the actual Task Object
      const [movedTask] = newActiveTasks.splice(activeTaskIndex, 1);
      newOverTasks.splice(newIndex, 0, movedTask);

      const newGroups = [...prev];
      newGroups[activeGroupIndex] = { ...activeGroup, tasks: newActiveTasks };
      newGroups[overGroupIndex] = { ...overGroup, tasks: newOverTasks };

      return newGroups;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveId(null);
    setActiveTask(null);

    if (!over) return;

    const activeGroupId = active.id as string;
    const overGroupId = over.id as string;

    // Group Reorder
    if (groups.some((g) => (g.id || g.title) === activeGroupId)) {
      if (activeGroupId !== overGroupId) {
        const oldIndex = groups.findIndex(
          (g) => (g.id || g.title) === activeGroupId,
        );
        const newIndex = groups.findIndex(
          (g) => (g.id || g.title) === overGroupId,
        );
        setGroups((items) => arrayMove(items, oldIndex, newIndex));
      }
      return;
    }

    // Task Reorder
    const activeGroup = findGroup(active.id as string);
    const overGroup = findGroup(over.id as string);

    if (activeGroup && overGroup && activeGroup === overGroup) {
      const activeIndex = activeGroup.tasks.findIndex(
        (t: any) => getTaskId(t) === active.id,
      );
      const overIndex = overGroup.tasks.findIndex(
        (t: any) => getTaskId(t) === over.id,
      );

      if (activeIndex !== overIndex) {
        const newTasks = arrayMove(activeGroup.tasks, activeIndex, overIndex);
        const newGroups = groups.map((g) =>
          g === activeGroup ? { ...g, tasks: newTasks } : g,
        );
        setGroups(newGroups);
      }
    }
  }

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: { active: { opacity: '0.5' } },
    }),
  };

  return (
    <div className="space-y-8">
      {/* ✅ FIX: Render User Stories correctly (Handle Objects) */}
      <div className="p-6 rounded-2xl bg-gray-900 border border-gray-800">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="text-blue-400">#</span> User Stories
        </h2>
        <ul className="space-y-2">
          {output.stories?.map((s: any, i: number) => (
            <li key={i} className="flex gap-3 text-gray-300">
              <span className="text-gray-500 mt-1">•</span>
              {/* Check if s is string or object */}
              <span>{typeof s === 'string' ? s : s.content}</span>
            </li>
          ))}
        </ul>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="overflow-x-auto pb-4">
          <SortableContext
            items={groupIds}
            strategy={horizontalListSortingStrategy}
          >
            <div className="flex gap-6 min-w-max">
              {groups.map((group) => (
                <TaskGroup
                  key={group.id || group.title}
                  group={group}
                  id={group.id || group.title}
                  onUpdate={(updated: any) => {
                    setGroups(
                      groups.map((g) =>
                        g.title === updated.title ? updated : g,
                      ),
                    );
                  }}
                />
              ))}
            </div>
          </SortableContext>
        </div>

        {createPortal(
          <DragOverlay dropAnimation={dropAnimation}>
            {activeId ? (
              activeTask ? (
                <div className="p-3 bg-gray-800 rounded-lg shadow-2xl border border-blue-500/50 rotate-2 cursor-grabbing text-white">
                  {typeof activeTask === 'string'
                    ? activeTask
                    : activeTask.content}
                </div>
              ) : (
                <div className="w-80 h-full bg-gray-900/90 rounded-2xl border border-gray-700 shadow-2xl p-5" />
              )
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>

      {/* Pass corrected data to ExportBox */}
      <ExportBox groups={groups} stories={output.stories} />
    </div>
  );
}
