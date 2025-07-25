'use client';
import { useState } from 'react';
import { 
  FaFolder, 
  FaFolderOpen, 
  FaFile, 
  FaChevronRight, 
  FaChevronDown, 
  FaEdit, 
  FaTrash, 
  FaPlus, 
  FaFolderPlus 
} from 'react-icons/fa';

const TreeNode = ({ node, onNodeUpdate, onNodeDelete, onNodeCreate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [newNodeName, setNewNodeName] = useState(node.name);

  const handleToggle = () => {
    if (node.isFolder) {
      setIsOpen(!isOpen);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    onNodeDelete(node.id);
  };

  const handleCreateFile = () => {
    const fileName = prompt('Enter file name:');
    if (fileName) {
      onNodeCreate(node.id, fileName, false);
      setShowAddOptions(false);
      setIsOpen(true);
    }
  };

  const handleCreateFolder = () => {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
      onNodeCreate(node.id, folderName, true);
      setShowAddOptions(false);
      setIsOpen(true);
    }
  };

  const handleNameChange = (e) => {
    setNewNodeName(e.target.value);
  };

  const handleNameBlur = () => {
    onNodeUpdate(node.id, newNodeName);
    setIsEditing(false);
  };

  return (
    <div>
      <div 
        className="group flex items-center justify-between p-1 cursor-pointer rounded-md hover:bg-gray-700"
        onMouseEnter={() => setShowAddOptions(true)} 
        onMouseLeave={() => setShowAddOptions(false)}
      >
        <div className="flex items-center" onClick={handleToggle}>
          <span className="mr-2 w-4 h-4 text-gray-400">
            {node.isFolder && (isOpen ? <FaChevronDown /> : <FaChevronRight />)}
          </span>
          <span className="mr-2 w-4 h-4 text-blue-400">
            {node.isFolder ? (isOpen ? <FaFolderOpen /> : <FaFolder />) : <FaFile />}
          </span>
          {isEditing ? (
            <input 
              type="text" 
              value={newNodeName} 
              onChange={handleNameChange} 
              onBlur={handleNameBlur} 
              autoFocus 
              className="ml-2 bg-gray-800 text-white border border-gray-600 rounded px-1"
            />
          ) : (
            <span>{node.name}</span>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 flex items-center">
            {node.isFolder && (
              <>
                <button onClick={handleCreateFile} className="bg-transparent border-none cursor-pointer p-1 ml-1 text-gray-400 hover:text-white"><FaPlus /></button>
                <button onClick={handleCreateFolder} className="bg-transparent border-none cursor-pointer p-1 ml-1 text-gray-400 hover:text-white"><FaFolderPlus /></button>
              </>
            )}
            <button onClick={handleEdit} className="bg-transparent border-none cursor-pointer p-1 ml-1 text-gray-400 hover:text-white"><FaEdit /></button>
            <button onClick={handleDelete} className="bg-transparent border-none cursor-pointer p-1 ml-1 text-gray-400 hover:text-white"><FaTrash /></button>
        </div>
      </div>
      {isOpen && node.children && (
        <div className="ml-4 pl-2 border-l border-gray-700">
          {node.children.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              onNodeUpdate={onNodeUpdate}
              onNodeDelete={onNodeDelete}
              onNodeCreate={onNodeCreate}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode; 