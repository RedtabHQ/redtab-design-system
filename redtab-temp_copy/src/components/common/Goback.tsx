import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export interface GobackProps {
    link: string;
    className?: string;
}


export const Goback: React.FC<GobackProps> = ({ link, className = '' }) => {
    const navigate = useNavigate();
    
    return (
        <button
          onClick={() => navigate(link)}
          className="p-2 bg-white cursor-pointer border border-gray-200 rounded text-gray-400 hover:text-gray-900 transition-colors shadow-sm"
        >
          <ArrowLeft size={20} />
        </button>
    );
};