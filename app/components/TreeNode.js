'use client';
import { useState } from 'react';
import Swal from 'sweetalert2';
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

const TreeNode = ({ node, onNodeUpdate, onNodeDelete, onNodeCreate, onFileSelect, selectedFile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddOptions, setShowAddOptions] = useState(false);
  const [newNodeName, setNewNodeName] = useState(node.name);

  const handleToggle = () => {
    if (node.isFolder) {
      setIsOpen(!isOpen);
    } else {
      // If it's a file, select it
      if (onFileSelect) {
        onFileSelect(node);
      }
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete "${node.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      background: '#1f2937',
      color: '#f9fafb',
    });

    if (result.isConfirmed) {
      onNodeDelete(node.id);
      Swal.fire({
        title: 'Deleted!',
        text: `"${node.name}" has been deleted.`,
        icon: 'success',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#10b981',
      });
    }
  };

  const handleCreateFile = async () => {
    const { value: fileName } = await Swal.fire({
      title: 'Create New File',
      input: 'text',
      inputLabel: 'File name',
      inputPlaceholder: 'Enter file name (e.g., index.js)',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      background: '#1f2937',
      color: '#f9fafb',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter a file name!';
        }
        if (value.includes('/') || value.includes('\\')) {
          return 'File name cannot contain / or \\';
        }
      }
    });

    if (fileName) {
      const result = onNodeCreate(node.id, fileName, false);
      
      if (result && !result.success) {
        // Show error if duplicate name
        await Swal.fire({
          title: 'Error!',
          text: result.message,
          icon: 'error',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#ef4444',
        });
        return;
      }
      
      setShowAddOptions(false);
      setIsOpen(true);
      
      Swal.fire({
        title: 'Success!',
        text: `File "${fileName}" has been created.`,
        icon: 'success',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#10b981',
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const handleCreateFolder = async () => {
    const { value: folderName } = await Swal.fire({
      title: 'Create New Folder',
      input: 'text',
      inputLabel: 'Folder name',
      inputPlaceholder: 'Enter folder name (e.g., components)',
      showCancelButton: true,
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#6b7280',
      background: '#1f2937',
      color: '#f9fafb',
      inputValidator: (value) => {
        if (!value) {
          return 'You need to enter a folder name!';
        }
        if (value.includes('/') || value.includes('\\')) {
          return 'Folder name cannot contain / or \\';
        }
      }
    });

    if (folderName) {
      const result = onNodeCreate(node.id, folderName, true);
      
      if (result && !result.success) {
        // Show error if duplicate name
        await Swal.fire({
          title: 'Error!',
          text: result.message,
          icon: 'error',
          background: '#1f2937',
          color: '#f9fafb',
          confirmButtonColor: '#ef4444',
        });
        return;
      }
      
      setShowAddOptions(false);
      setIsOpen(true);
      
      Swal.fire({
        title: 'Success!',
        text: `Folder "${folderName}" has been created.`,
        icon: 'success',
        background: '#1f2937',
        color: '#f9fafb',
        confirmButtonColor: '#10b981',
        timer: 2000,
        timerProgressBar: true,
      });
    }
  };

  const handleNameChange = (e) => {
    setNewNodeName(e.target.value);
  };

  const handleNameBlur = () => {
    onNodeUpdate(node.id, newNodeName);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onNodeUpdate(node.id, newNodeName);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setNewNodeName(node.name);
      setIsEditing(false);
    }
  };

  const isSelected = selectedFile && selectedFile.id === node.id;

  return (
    <div>
      <div 
        className={`group flex items-center justify-between p-2 cursor-pointer rounded-md transition-colors duration-200 ${
          isSelected 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'hover:bg-gray-700'
        }`}
        onClick={handleToggle}
        onMouseEnter={() => setShowAddOptions(true)} 
        onMouseLeave={() => setShowAddOptions(false)}
      >
        <div className="flex items-center flex-1 min-w-0">
          <span className={`mr-2 w-4 h-4 flex-shrink-0 ${isSelected ? 'text-blue-200' : 'text-gray-400'}`}>
            {node.isFolder && (isOpen ? <FaChevronDown /> : <FaChevronRight />)}
          </span>
          <span className={`mr-2 w-4 h-4 flex-shrink-0 ${isSelected ? 'text-blue-200' : 'text-blue-400'}`}>
            {node.isFolder ? (isOpen ? <FaFolderOpen /> : <FaFolder />) : <FaFile />}
          </span>
          {isEditing ? (
            <input 
              type="text" 
              value={newNodeName} 
              onChange={handleNameChange} 
              onBlur={handleNameBlur}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              autoFocus 
              className="bg-gray-700 text-white border border-gray-600 rounded px-2 py-1 text-sm max-w-[200px]"
            />
          ) : (
            <span className={`select-none truncate max-w-[200px] ${isSelected ? 'text-white font-medium' : 'text-gray-200'}`}>
              {node.name.length > 25 ? `${node.name.substring(0, 25)}...` : node.name}
              {!node.isFolder && isSelected && (
                <span className="ml-2 text-blue-200 text-xs">● Open</span>
              )}
            </span>
          )}
        </div>
        {showAddOptions && (
          <div className="flex items-center bg-gray-700 rounded-md p-1 shadow-lg border border-gray-600 z-[60] relative flex-shrink-0">
            {node.isFolder && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateFile();
                  }} 
                  className="bg-gray-600 hover:bg-gray-500 border-none cursor-pointer p-1.5 mx-0.5 rounded text-gray-300 hover:text-white transition-colors duration-200 text-xs relative z-[60]"
                  title="New File"
                >
                  <FaPlus />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateFolder();
                  }} 
                  className="bg-gray-600 hover:bg-gray-500 border-none cursor-pointer p-1.5 mx-0.5 rounded text-gray-300 hover:text-white transition-colors duration-200 text-xs relative z-[60]"
                  title="New Folder"
                >
                  <FaFolderPlus />
                </button>
              </>
            )}
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleEdit();
              }} 
              className="bg-blue-600 hover:bg-blue-500 border-none cursor-pointer p-1.5 mx-0.5 rounded text-white transition-colors duration-200 text-xs relative z-[60]"
              title="Rename"
            >
              <FaEdit />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }} 
              className="bg-red-600 hover:bg-red-500 border-none cursor-pointer p-1.5 mx-0.5 rounded text-white transition-colors duration-200 text-xs relative z-[60]"
              title="Delete"
            >
              <FaTrash />
            </button>
          </div>
        )}
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
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TreeNode; 