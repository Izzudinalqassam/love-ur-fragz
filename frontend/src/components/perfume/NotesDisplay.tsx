import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Sparkles } from 'lucide-react';
import type { Note } from '@/types';

interface NotesDisplayProps {
  notes: Note[];
  variant?: 'detailed' | 'compact' | 'minimal';
  showTitle?: boolean;
}

const NotesDisplay: React.FC<NotesDisplayProps> = ({
  notes,
  variant = 'detailed',
  showTitle = true
}) => {
  // Group notes by type
  const topNotes = notes.filter(note => note.type === 'top');
  const middleNotes = notes.filter(note => note.type === 'middle');
  const baseNotes = notes.filter(note => note.type === 'base');

  const getNotesConfig = (type: string) => {
    switch (type) {
      case 'top':
        return {
          title: 'Top Notes',
          icon: <Sparkles className="h-4 w-4 mr-2 text-green-600" />,
          badgeClass: 'bg-green-50 border-green-200 text-green-800'
        };
      case 'middle':
        return {
          title: 'Middle Notes',
          icon: <Sparkles className="h-4 w-4 mr-2 text-blue-600" />,
          badgeClass: 'bg-blue-50 border-blue-200 text-blue-800'
        };
      case 'base':
        return {
          title: 'Base Notes',
          icon: <Sparkles className="h-4 w-4 mr-2 text-purple-600" />,
          badgeClass: 'bg-purple-50 border-purple-200 text-purple-800'
        };
      default:
        return {
          title: 'Notes',
          icon: <Sparkles className="h-4 w-4 mr-2 text-gray-600" />,
          badgeClass: 'bg-gray-50 border-gray-200 text-gray-800'
        };
    }
  };

  const renderNoteGroup = (notes: Note[], type: string) => {
    if (notes.length === 0) return null;

    const config = getNotesConfig(type);

    if (variant === 'minimal') {
      return (
        <div className="flex flex-wrap gap-1">
          {notes.slice(0, 3).map((note, index) => (
            <span
              key={index}
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full border border-gray-200"
            >
              {note.note_name}
            </span>
          ))}
          {notes.length > 3 && (
            <span className="text-xs text-gray-500">
              +{notes.length - 3} more
            </span>
          )}
        </div>
      );
    }

    if (variant === 'compact') {
      return (
        <div className="mb-2">
          <h4 className="text-xs font-semibold text-gray-700 mb-1">
            {showTitle && config.icon}
            {showTitle && config.title}
          </h4>
          <div className="flex flex-wrap gap-1">
            {notes.map((note, index) => (
              <Badge
                key={index}
                variant="outline"
                size="sm"
                className={config.badgeClass}
              >
                {note.note_name}
              </Badge>
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={`mb-6 ${type !== 'top' ? 'mt-4' : ''}`}>
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
          {config.icon}
          {config.title}
        </h4>
        <div className="flex flex-wrap gap-2">
          {notes.map((note, index) => (
            <Badge
              key={index}
              variant="outline"
              className={config.badgeClass}
            >
              {note.note_name}
            </Badge>
          ))}
        </div>
      </div>
    );
  };

  if (variant === 'minimal') {
    return (
      <div>
        {renderNoteGroup(topNotes, 'top')}
      </div>
    );
  }

  return (
    <div>
      {renderNoteGroup(topNotes, 'top')}
      {renderNoteGroup(middleNotes, 'middle')}
      {renderNoteGroup(baseNotes, 'base')}
    </div>
  );
};

export default NotesDisplay;