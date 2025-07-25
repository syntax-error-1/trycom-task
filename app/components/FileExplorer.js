'use client';
import React, { useState, useRef } from 'react';
import TreeNode from './TreeNode';

const initialTree = {
  id: 'root',
  name: 'Project Files',
  isFolder: true,
  children: [
    {
      id: '1',
      name: 'public',
      isFolder: true,
      children: [
        { id: '2', name: 'index.html', isFolder: false, children: [] },
        { id: '3', name: 'styles.css', isFolder: false, children: [] },
      ],
    },
    {
      id: '4',
      name: 'src',
      isFolder: true,
      children: [
        { id: '5', name: 'App.js', isFolder: false, children: [] },
        { id: '6', name: 'index.js', isFolder: false, children: [] },
        { id: '7', name: 'components', isFolder: true, children: [] },
      ],
    },
  ],
};

const MIN_WIDTH = 400;
const MAX_WIDTH = 1000;

const FileExplorer = ({ onClose, onFileSelect, selectedFile }) => {
  const [tree, setTree] = useState(initialTree);
  const [sidebarWidth, setSidebarWidth] = useState(320);
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef(null);

  // Helper function to check if name already exists at the same level
  const checkDuplicateName = (parentId, name) => {
    const findParentChildren = (nodes, targetId) => {
      for (let node of nodes) {
        if (node.id === targetId) {
          return node.children || [];
        }
        if (node.children) {
          const result = findParentChildren(node.children, targetId);
          if (result) return result;
        }
      }
      return null;
    };

    let siblings;
    if (parentId === 'root') {
      siblings = tree.children;
    } else {
      siblings = findParentChildren(tree.children, parentId);
    }

    return siblings ? siblings.some(sibling => sibling.name.toLowerCase() === name.toLowerCase()) : false;
  };

  const handleNodeUpdate = (nodeId, newName) => {
    const newTree = { ...tree };
    const updateNode = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === nodeId) {
          nodes[i].name = newName;
          return true;
        }
        if (nodes[i].children && updateNode(nodes[i].children)) {
          return true;
        }
      }
      return false;
    };
    updateNode(newTree.children);
    setTree(newTree);
  };

  const handleNodeDelete = (nodeId) => {
    const newTree = { ...tree };
    const deleteNode = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === nodeId) {
          nodes.splice(i, 1);
          return true;
        }
        if (nodes[i].children && deleteNode(nodes[i].children)) {
          return true;
        }
      }
      return false;
    };
    deleteNode(newTree.children);
    setTree(newTree);
  };

  const handleNodeCreate = (parentId, name, isFolder) => {
    if (checkDuplicateName(parentId, name)) {
      return { success: false, message: `A ${isFolder ? 'folder' : 'file'} with the name "${name}" already exists at this level.` };
    }

    const newTree = { ...tree };
    const newNode = {
      id: new Date().getTime().toString(),
      name,
      isFolder,
      children: isFolder ? [] : undefined,
    };

    const addNode = (nodes) => {
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].id === parentId && nodes[i].isFolder) {
          nodes[i].children.push(newNode);
          return true;
        }
        if (nodes[i].children && addNode(nodes[i].children)) {
          return true;
        }
      }
      return false;
    };

    if (parentId === 'root') {
      newTree.children.push(newNode);
    } else {
      addNode(newTree.children);
    }

    setTree(newTree);
    return { success: true };
  };

  // Resizer handlers
  const handleMouseDown = (e) => {
    setIsResizing(true);
    document.body.style.cursor = 'col-resize';
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    let newWidth = e.clientX - (sidebarRef.current?.getBoundingClientRect().left || 0);
    newWidth = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, newWidth));
    setSidebarWidth(newWidth);
  };

  const handleMouseUp = () => {
    setIsResizing(false);
    document.body.style.cursor = '';
  };

  // Attach/detach mousemove/mouseup listeners
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  return (
    <div
      ref={sidebarRef}
      className="bg-gray-800 text-white border-r border-gray-700 flex flex-col h-screen relative select-none"
      style={{ width: sidebarWidth, minWidth: MIN_WIDTH, maxWidth: MAX_WIDTH }}
    >
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-200">File Explorer</h2>
        {onClose && (
          <button
            className="ml-2 px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors duration-200 text-sm"
            onClick={onClose}
            aria-label="Hide sidebar"
          >
            &times;
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
        <TreeNode
          node={tree}
          onNodeUpdate={handleNodeUpdate}
          onNodeDelete={handleNodeDelete}
          onNodeCreate={handleNodeCreate}
          onFileSelect={onFileSelect}
          selectedFile={selectedFile}
        />
      </div>
      {/* Resizer */}
      <div
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize z-10 bg-transparent hover:bg-gray-600 transition-colors duration-200"
        onMouseDown={handleMouseDown}
        style={{ userSelect: 'none' }}
      />
    </div>
  );
};

export default FileExplorer; 