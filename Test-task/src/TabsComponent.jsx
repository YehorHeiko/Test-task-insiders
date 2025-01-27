import React, { useState, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useNavigate, useLocation } from "react-router-dom";

const loadTabs = () => {
  try {
    const savedTabs = localStorage.getItem("tabsState");
    return savedTabs ? JSON.parse(savedTabs) : null;
  } catch (error) {
    console.error("Ошибка загрузки вкладок:", error);
    return null;
  }
};

const TabsComponent = ({ initialTabs }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [tabs, setTabs] = useState([]);
  const [overflowTabs, setOverflowTabs] = useState([]);
  const [showLeftShadow, setShowLeftShadow] = useState(false);
  const [showRightShadow, setShowRightShadow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const savedTabs = loadTabs();
    setTabs(savedTabs && savedTabs.length > 0 ? savedTabs : initialTabs);
  }, [initialTabs]);

  useEffect(() => {
    if (tabs.length > 0) {
      localStorage.setItem("tabsState", JSON.stringify(tabs));
    }
  }, [tabs]);


  const onDragEnd = (res) => {
    const { source, destination } = res;
    if (!destination || source.index === destination.index) return;

    const reorderedTabs = [...tabs];
    const [movedTab] = reorderedTabs.splice(source.index, 1);
    reorderedTabs.splice(destination.index, 0, movedTab);
    setTabs(reorderedTabs);
  };


  const togglePin = (id) => {
    setTabs((prevTabs) => {
      return prevTabs.map((tab) =>
        tab.id === id ? { ...tab, pinned: !tab.pinned } : tab
      );
    });
  };


  useEffect(() => {
    const updateOverflowTabs = () => {
      const container = document.getElementById("tabs-container");
      if (!container) return;

      const containerWidth = container.offsetWidth;
      let totalWidth = 0;
      const visibleTabs = [];
      const hiddenTabs = [];

      tabs.forEach((tab) => {
        const tabWidth = tab.pinned ? 100 : 80;
        totalWidth += tabWidth;

        if (totalWidth <= containerWidth || tab.pinned) {
          visibleTabs.push(tab);
        } else {
          hiddenTabs.push(tab);
        }
      });

      setOverflowTabs(hiddenTabs);
      setShowLeftShadow(container.scrollLeft > 0);
      setShowRightShadow(totalWidth > containerWidth);
      setShowMenu(hiddenTabs.length > 0);
    };

    updateOverflowTabs();
    window.addEventListener("resize", updateOverflowTabs);
    return () => window.removeEventListener("resize", updateOverflowTabs);
  }, [tabs]);

  return (
    <div className="tabs-wrapper">
      <div className={`shadow left ${showLeftShadow ? "visible" : ""}`} />
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="tabs" direction="horizontal">
          {(e) => (
            <div
              id="tabs-container"
              className="tabs-container"
              ref={e.innerRef}
              {...e.droppableProps}
            >
              {tabs.map((tab, index) => (
                <Draggable key={tab.id} draggableId={tab.id} index={index} isDragDisabled={tab.pinned}>
                  {(e, n) => (
                    <div
                      className={`tab ${location.pathname === tab.url ? "active" : ""} ${n.isDragging ? "dragging" : ""}`}
                      ref={e.innerRef}
                      {...e.draggableProps}
                      {...e.dragHandleProps}
                    >
                      <span onClick={() => navigate(tab.url)}>{tab.name}</span>
                      <button className="pin-button" onClick={() => togglePin(tab.id)}>
                        {tab.pinned ? "📌" : "📍"}
                      </button>
                    </div>
                  )}
                </Draggable>
              ))}
              {e.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      <div className={`shadow right ${showRightShadow ? "visible" : ""}`} />

      {showMenu && (
        <div className="overflow-menu">
          <span>More ▼</span>
          <div className="dropdown-menu">
            {overflowTabs.map((tab) => (
              <div key={tab.id} className="dropdown-item" onClick={() => navigate(tab.url)}>
                {tab.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TabsComponent;
