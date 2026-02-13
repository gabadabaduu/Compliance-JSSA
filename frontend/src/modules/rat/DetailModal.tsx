import { Icon } from '@iconify/react';
import { ReactNode } from 'react';

interface DetailField {
    label: string;
    value: ReactNode;
    fullWidth?: boolean;
}

interface DetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    icon: string;
    iconColor: string;
    fields: DetailField[];
    extraFooter?: ReactNode;
}

export default function DetailModal({ isOpen, onClose, title, icon, iconColor, fields, extraFooter }: DetailModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />
            
            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-3">
                            <Icon icon={icon} width="28" height="28" className={iconColor} />
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
                                {title}
                            </h2>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                            <Icon icon="mdi:close" width="24" height="24" className="text-gray-500" />
                        </button>
                    </div>

                    {/* Content */}
                    <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fields.map((field, index) => (
                                <div 
                                    key={index} 
                                    className={`${field.fullWidth ? 'md:col-span-2' : ''}`}
                                >
                                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
                                        {field.label}
                                    </label>
                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-3 min-h-[42px]">
                                        <span className="text-sm text-gray-800 dark:text-gray-200">
                                            {field.value || <span className="text-gray-400">-</span>}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg transition-colors"
                        >
                            Cerrar
                        </button>
                        {extraFooter}
                    </div>
                </div>
            </div>
        </div>
    );
}