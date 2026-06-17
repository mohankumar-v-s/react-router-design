import { reactRouter } from '@react-router/dev/vite';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import AutoImport from 'unplugin-auto-import/vite';

export default defineConfig({
  plugins:
    [ tailwindcss(), reactRouter(), tsconfigPaths(), AutoImport({
      imports: [
        'react',
        'react-router',
        {
          'axios': [['default', 'axios']],
          'react-router': [
            'Form',
            'useActionData',
            'useLoaderData',
            'useNavigate',
            'useNavigation',
            'Outlet',
            'redirect',
            'data',
            'Link',
            'useLocation',
            'useMatch',
            'useOutletContext',
            'useSubmit'
          ],
          '@heroui/react': [
            'Breadcrumbs',
            'BreadcrumbItem',
            'Autocomplete',
            'AutocompleteItem',
            'Button',
            'Input',
            'Textarea',
            'CheckboxGroup',
            'Checkbox',
            'DatePicker',
            'RadioGroup',
            'Radio',
            'useRadio',
            'cn',
            'Divider',
            'Card',
            'CardBody',
            'CardHeader',
            'Progress',
            'Chip',
            'Navbar',
            'NavbarBrand',
            'NavbarContent',
            'NavbarItem',
            'Avatar',
            'useDisclosure',
            'Accordion',
            'AccordionItem',
            'Tabs',
            'Tab',
            'Modal',
            'ModalContent',
            'ModalHeader',
            'ModalBody',
            'ModalFooter',
            'VisuallyHidden',
            'Drawer',
            'DrawerContent',
            'DrawerHeader',
            'DrawerBody',
            'DrawerFooter'
          ],
          '@heroicons/react/24/outline': [
            'EllipsisVerticalIcon'
          ],
          'lucide-react': [
            'CopyIcon',
            'SearchIcon',
            'BookAIcon',
            'SettingsIcon',
            'NotebookIcon',
            'ArrowRight',
            'NotepadText',
            'PlusIcon',
            'UploadIcon',
            'ArrowLeft',
            'EyeIcon',
            'DownloadIcon',
            'HelpCircleIcon',
            'InfoIcon',
            'HomeIcon'
          ],
          'framer-motion': [
            'motion'
          ],
        }
      ],
      dts: './auto-imports.d.ts',
      include: [/\.[tj]sx?$/],
    })],
});
