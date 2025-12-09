
import { Bell, Languages, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/config/contexts/LanguageContext';

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="bg-nalco-blue text-white w-full flex items-center justify-between p-2 px-4">
      <h1 className="text-md font-mono">{title}</h1>
      
      <div className="flex items-center gap-4">
        <div className="relative">
          <Bell className="h-5 w-5 cursor-pointer" />
          <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-[10px] flex items-center justify-center">
            3
          </span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-blue-500 hover:bg-blue-600 text-white border-blue-400">
              <Languages className="h-4 w-4 mr-2" />
              {t('selectLanguage')}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40">
            <DropdownMenuItem onClick={() => setLanguage('en')}>
              English {language === 'en' && '✓'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setLanguage('hi')}>
              हिंदी {language === 'hi' && '✓'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="destructive" size="sm">
          <LogOut className="h-4 w-4 mr-2" />
          {t('logout')}
        </Button>
      </div>
    </div>
  );
};

export default Header;

