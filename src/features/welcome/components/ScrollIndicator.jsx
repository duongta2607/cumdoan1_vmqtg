import { ChevronDown } from 'lucide-react';

export default function ScrollIndicator() {
  return (
    <div className="scroll-indicator" aria-hidden="true">
      <ChevronDown size={19} />
    </div>
  );
}
