import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Cpu, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { AIProvider } from '@/config/gemini';
import { getAvailableModels, getModelInfo, getCurrentModel } from '@/config/gemini';

interface ModelSelectorProps {
  provider: AIProvider;
  value?: string;
  onValueChange?: (model: string) => void;
  showLabel?: boolean;
  showDescription?: boolean;
  className?: string;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  provider,
  value,
  onValueChange,
  showLabel = true,
  showDescription = true,
  className = ''
}) => {
  const currentModel = value || getCurrentModel(provider);
  const availableModels = getAvailableModels(provider);
  const currentModelInfo = getModelInfo(provider, currentModel);

  const handleModelChange = (model: string) => {
    // 保存到localStorage
    localStorage.setItem(`${provider}_model`, model);
    onValueChange?.(model);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {showLabel && (
        <Label className="flex items-center gap-2">
          <Cpu className="w-4 h-4" />
          模型选择
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="w-3 h-3 text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <p>不同模型有不同的特性和性能表现</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </Label>
      )}
      
      <Select value={currentModel} onValueChange={handleModelChange}>
        <SelectTrigger>
          <SelectValue placeholder="选择模型" />
        </SelectTrigger>
        <SelectContent>
          {availableModels.map((model) => {
            const modelInfo = getModelInfo(provider, model);
            return (
              <SelectItem key={model} value={model}>
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{modelInfo.name}</span>
                    {modelInfo.recommended && (
                      <Badge variant="default" className="text-xs">推荐</Badge>
                    )}
                  </div>
                  {showDescription && (
                    <span className="text-xs text-gray-500 mt-1">
                      {modelInfo.description}
                    </span>
                  )}
                </div>
              </SelectItem>
            );
          })}
        </SelectContent>
      </Select>
      
      {/* 当前模型信息 */}
      {showDescription && currentModelInfo && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-4 h-4 text-blue-600" />
            <span className="font-medium text-sm">{currentModelInfo.name}</span>
            {currentModelInfo.recommended && (
              <Badge variant="default" className="text-xs">推荐</Badge>
            )}
          </div>
          
          <p className="text-xs text-gray-600 mb-2">
            {currentModelInfo.description}
          </p>
          
          <div className="flex flex-wrap gap-1">
            {currentModelInfo.features.map((feature, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {feature}
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 简化版本，只显示选择器
export const SimpleModelSelector: React.FC<Omit<ModelSelectorProps, 'showLabel' | 'showDescription'>> = (props) => {
  return (
    <ModelSelector 
      {...props} 
      showLabel={false} 
      showDescription={false}
    />
  );
};

// 带完整信息的版本
export const DetailedModelSelector: React.FC<ModelSelectorProps> = (props) => {
  return (
    <ModelSelector 
      {...props} 
      showLabel={true} 
      showDescription={true}
    />
  );
};
