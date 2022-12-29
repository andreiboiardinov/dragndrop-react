import React, { useRef, useState } from 'react';
import apiMockData from "./apiMockData.js";

const DragNDrop = () => {
    const [data, setData] = useState(apiMockData);
    const [isDragging, setIsDragging] = useState(false)
    const draggableItem = useRef();
    const draggableItemNode = useRef();

    const handleDragStart = (e, draggable) => {
        setIsDragging(true)
        draggableItem.current = draggable
        draggableItemNode.current = e.target
        draggableItemNode.current.addEventListener('dragend', handleDragEnd)
    }

    const handleDragEnd = (e) => {
        setIsDragging(false);
        draggableItem.current = null;
        draggableItemNode.current.removeEventListener('dragend', handleDragEnd)
        draggableItemNode.current = null;
    }

    const handleDragEnter = (e, targetItem) => {
        const currentItem = draggableItem.current
        if (draggableItemNode.current !== e.target) {
            setData(prevState => {
                let newData = JSON.parse(JSON.stringify(prevState))
                newData[targetItem.groupIndex].items.splice(targetItem.itemIndex, 0, newData[currentItem.groupIndex].items.splice(currentItem.itemIndex, 1))
                draggableItem.current = targetItem

                return newData
            })
        }
    }

    const getStyles = (params) => {
        if (draggableItem.current.groupIndex === params.groupIndex && draggableItem.current.itemIndex === params.itemIndex) {
            return "draggable current"
        }

        return "draggable"
    }

    return (
        <div className="drag-n-drop">
            {data.map((group, groupIndex) => (
                <div
                    onDragEnter={!group.items.length ? (e) => handleDragEnter(e, { groupIndex, itemIndex: 0 }) : null}
                    key={group.title}
                    className="container"
                >
                    {group.items.map((item, itemIndex) => (
                        <div
                            onDragStart={e => handleDragStart(e, { groupIndex, itemIndex })}
                            onDragEnter={e => handleDragEnter(e, { groupIndex, itemIndex })}
                            draggable
                            key={item}
                            className={isDragging ? getStyles({ groupIndex, itemIndex }) : 'draggable'}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default DragNDrop;