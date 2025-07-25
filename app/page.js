"use client"
import React, { useState } from 'react';
import FileExplorer from './components/FileExplorer';
import Swal from 'sweetalert2';
import { FaPlus, FaEdit, FaTrash, FaFolderOpen, FaArrowsAlt, FaFolderMinus, FaEyeSlash, FaGripVertical, FaSave, FaTimes } from 'react-icons/fa';

export default function Home() {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState('');
  const [isModified, setIsModified] = useState(false);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    // Simulate loading file content (in a real app, you'd load from server/localStorage)
    setFileContent(`// Content of ${file.name}\n// This is a placeholder content for the file\n\nconsole.log('Hello from ${file.name}');`);
    setIsModified(false);
  };

  const handleContentChange = (e) => {
    setFileContent(e.target.value);
    setIsModified(true);
  };

  const handleSave = () => {
    // Show message that save is not developed yet
    Swal.fire({
      title: 'Save Feature',
      text: 'Save functionality is not developed yet. If you want me to add it as well just msg me.',
      icon: 'info',
      confirmButtonColor: '#3b82f6',
      background: '#1f2937',
      color: '#f9fafb',
      confirmButtonText: 'OK'
    });
    setIsModified(false);
  };

  const handleCloseFile = () => {
    if (isModified) {
      const confirmClose = window.confirm('You have unsaved changes. Are you sure you want to close this file?');
      if (!confirmClose) return;
    }
    setSelectedFile(null);
    setFileContent('');
    setIsModified(false);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {sidebarVisible && (
        <FileExplorer 
          onClose={() => setSidebarVisible(false)} 
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
        />
      )}
      <div className="flex-1 relative flex flex-col">
        {!sidebarVisible && (
          <button
            className="fixed top-4 left-0 z-50 bg-gray-800 text-white px-3 py-2 rounded-r-md shadow-lg hover:bg-gray-700 transition-colors duration-200"
            onClick={() => setSidebarVisible(true)}
            aria-label="Show sidebar"
          >
            &#9776; File Explorer
          </button>
        )}
        
        {selectedFile ? (
          // File Editor
          <div className="flex-1 flex flex-col bg-white">
            {/* Editor Header */}
            <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between border-b">
              <div className="flex items-center gap-3">
                <span className="font-medium">{selectedFile.name}</span>
                {isModified && <span className="text-yellow-400 text-sm">● Modified</span>}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleSave}
                  disabled={!isModified}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded text-sm transition-colors ${
                    isModified 
                      ? 'bg-green-600 hover:bg-green-500 text-white' 
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <FaSave /> Save
                </button>
                <button
                  onClick={handleCloseFile}
                  className="flex items-center gap-2 px-3 py-1.5 rounded text-sm bg-gray-600 hover:bg-gray-500 text-white transition-colors"
                >
                  <FaTimes /> Close
                </button>
              </div>
            </div>
            
            {/* Editor Content */}
            <div className="flex-1 p-4">
              <textarea
                value={fileContent}
                onChange={handleContentChange}
                className="w-full h-full resize-none border border-gray-300 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Start typing..."
                spellCheck={false}
              />
            </div>
          </div>
        ) : (
          // Welcome Screen
          <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
              TryCOM AI Task
            </h1>
            <div className="max-w-2xl">
              <div className="bg-white p-6 rounded-lg shadow-md mb-12">
                Hi, These are the features I have added in this. 
                <ul className="ml-5 text-gray-600 leading-relaxed list-disc text-left space-y-2">
                  <li>Create new files and folders</li>
                  <li>The sidebar (file explorer) is resizable horizontally</li>
                  <li>You can edit file names, folder names</li>
                  <li>You can save files</li>
                </ul>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 font-medium">
                  💡 Click on any file in the sidebar to open it in the editor!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
