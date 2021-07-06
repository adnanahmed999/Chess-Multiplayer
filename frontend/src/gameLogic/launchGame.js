import React from 'react';
import CoreGame from './coreGame';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'

export default function LaunchGame() {
  return (
    <div>
      <DndProvider backend={HTML5Backend}>
        <CoreGame />
      </DndProvider>   
    </div>
  )
}
