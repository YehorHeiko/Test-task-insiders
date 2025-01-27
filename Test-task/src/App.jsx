import styles from "./App.module.css";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "react-tabs/style/react-tabs.css";
import { useState } from "react";

function App() {
  const [tabs, setTabs] = useState([
    { id: "tab1", title: "Dashboard", content: "Any content 1", pinned: false },
    { id: "tab2", title: "Banking", content: "Any content 2", pinned: false },
    { id: "tab3", title: "Telefonie", content: "Any content 3", pinned: false },
    {
      id: "tab4",
      title: "Accounting",
      content: "Any content 4",
      pinned: false,
    },
    { id: "tab5", title: "Verkauf", content: "Any content 5", pinned: false },
    { id: "tab6", title: "Statistik", content: "Any content 6", pinned: false },
    {
      id: "tab7",
      title: "Post Office",
      content: "Any content 7",
      pinned: false,
    },
    {
      id: "tab8",
      title: "Administration",
      content: "Any content 8",
      pinned: false,
    },
    { id: "tab9", title: "Help", content: "Any content 9", pinned: false },
    {
      id: "tab10",
      title: "Auswahllisten",
      content: "Any content 10",
      pinned: false,
    },
    { id: "tab11", title: "Einkauf", content: "Any content 11", pinned: false },
    { id: "tab12", title: "Rechn", content: "Any content 12", pinned: false },
  ]);

  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const [pinnedTab, setPinnedTab] = useState(false);

  const handlePinToggle = (id) => {
    setTabs((prevTabs) =>
      prevTabs.map((tab) =>
        tab.id === id ? { ...tab, pinned: !tab.pinned } : tab
      )
    );
  };

  const handleTabClick = (id) => {
    setActiveTab(id);
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination) return;

    const sourceDroppable = source.droppableId;
    const destinationDroppable = destination.droppableId;

    if (sourceDroppable !== destinationDroppable) {
      return;
    }

    const newTabs = Array.from(tabs);
    const [movedTab] = newTabs.splice(source.index, 1);
    newTabs.splice(destination.index, 0, movedTab);
    setTabs(newTabs);
  };

  return (
    <div className={styles.main}>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="1" direction="horizontal">
          {(e) => (
            <div
              ref={e.innerRef}
              {...e.droppableProps}
              style={{
                display: "flex",
                borderBottom: "1px solid #ccc",
                padding: "10px 0",
                justifyContent: "center",
              }}
            >
              {tabs.map((tab, index) => (
                <div
                  key={tab.id}
                  onMouseEnter={() => setPinnedTab(tab.id)}
                  onMouseLeave={() => setPinnedTab(null)}
                  style={{ position: "relative" }}
                >
                  {tab.pinned ? (
                    <div
                      onClick={() => handleTabClick(tab.id)}
                      style={{
                        padding: "5px 10px",
                        marginRight: "3px",
                        border: "1px solid #ccc",
                        borderRadius: "5px",
                        backgroundColor: "white",
                        cursor: "default",
                        color: tab.id === activeTab ? "blue" : "black",
                      }}
                    >
                      {tab.title}
                    </div>
                  ) : (
                    <Draggable key={tab.id} draggableId={tab.id} index={index}>
                      {(e) => (
                        <div
                          ref={e.innerRef}
                          {...e.draggableProps}
                          {...e.dragHandleProps}
                          onClick={() => handleTabClick(tab.id)}
                          style={{
                            padding: "5px 10px",
                            marginRight: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            backgroundColor: "white",
                            cursor: "pointer",
                            color: tab.id === activeTab ? "blue" : "black",
                            ...e.draggableProps.style,
                          }}
                        >
                          {tab.title}
                        </div>
                      )}
                    </Draggable>
                  )}

                  {pinnedTab === tab.id && (
                    <div
                      className={styles.button__pinn}
                      onClick={() => handlePinToggle(tab.id)}
                    >
                      {tab.pinned ? "pin" : "unpin"}
                    </div>
                  )}
                </div>
              ))}
              {e.placeholder}
            </div>
          )}
        </Droppable>
        <Tabs className={styles.tabs}>
          {tabs.map((tab) =>
            tab.id === activeTab ? (
              <TabPanel key={tab.id}>
                <h2>{tab.content}</h2>
              </TabPanel>
            ) : null
          )}
        </Tabs>
      </DragDropContext>
    </div>
  );
}

export default App;
