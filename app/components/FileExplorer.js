'use client';
import { useState } from 'react';
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

const FileExplorer = () => {
  const [tree, setTree] = useState(initialTree);

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
  };

  return (
    <div className="w-80 bg-gray-800 text-white p-4 h-screen border-r border-gray-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-200">File Explorer</h2>
      <TreeNode
        node={tree}
        onNodeUpdate={handleNodeUpdate}
        onNodeDelete={handleNodeDelete}
        onNodeCreate={handleNodeCreate}
      />
    </div>
  );
};

export default FileExplorer; 