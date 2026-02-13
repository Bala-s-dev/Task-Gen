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

  const getTaskId = (task: any) => (typeof task === 'string' ? task : task.id);

  // ✅ FIXED: Corrected scope of 'g'
  function findGroup(id: string) {
    const directGroup = groups.find((g) => (g.id || g.title) === id);
    if (directGroup) return directGroup;

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
    <div className="space-y-10">
      <div className="p-8 rounded-3xl bg-gray-900/40 border border-gray-800 backdrop-blur-sm">
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <span className="w-2 h-6 bg-blue-500 rounded-full" />
          User Stories
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {output.stories?.map((s: any, i: number) => (
            <li
              key={i}
              className="flex gap-4 p-4 rounded-xl bg-gray-800/30 border border-gray-700/30 text-gray-300 text-sm leading-relaxed"
            >
              <span className="text-blue-500 font-mono font-bold">
                {i + 1}.
              </span>
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
        <div className="overflow-x-auto pb-8 -mx-4 px-4 scroll-smooth">
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
                <div className="p-4 bg-blue-600 rounded-xl shadow-2xl border border-blue-400/50 rotate-3 cursor-grabbing text-white text-sm font-medium">
                  {typeof activeTask === 'string'
                    ? activeTask
                    : activeTask.content}
                </div>
              ) : (
                <div className="w-80 h-full bg-gray-900/90 rounded-2xl border border-gray-700 shadow-2xl p-5 backdrop-blur-md" />
              )
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </DndContext>

      <ExportBox groups={groups} stories={output.stories} />
    </div>
  );
}
