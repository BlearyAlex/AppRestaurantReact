import {useCallback, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {X, UploadCloud, ImageIcon} from 'lucide-react';
import {Button} from '@/components/ui/button';

interface ImageDropzoneProps {
    existingImageUrl?: string;
    previewUrl?: string;
    onFileSelected: (file: File | null) => void;
    onDeleteExisting?: () => void;
    error?: string;
}

function ImageDropzone({
existingImageUrl,
onFileSelected,
onDeleteExisting,
error,
}: ImageDropzoneProps) {
    const [localPreview, setLocalPreview] = useState<string | null>(null);
    const [deletedExisting, setDeletedExisting] = useState(false);

    useEffect(() => {
        setLocalPreview(null);
        setDeletedExisting(false);
    }, [existingImageUrl]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;
        setLocalPreview(URL.createObjectURL(file));
        setDeletedExisting(false);
        onFileSelected(file);
    }, [onFileSelected]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop,
        accept: {'image/*': []},
        multiple: false,
    });

    const handleRemove = () => {
        setLocalPreview(null);
        onFileSelected(null);

        // Si había imagen existente del servidor, notificar al padre
        if (existingImageUrl && !deletedExisting) {
            setDeletedExisting(true);
            onDeleteExisting?.();
        }
    };

    // Qué imagen mostrar: nueva > existente (si no fue eliminada) > nada
    const displayImage = localPreview ?? (!deletedExisting ? existingImageUrl : null);

    if (displayImage) {
        return (
            <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border group">
                <img
                    src={displayImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                />
                <div
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {/* Botón reemplazar */}
                    <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <Button type="button" size="sm" variant="secondary">
                            <UploadCloud className="w-4 h-4 mr-1"/> Cambiar
                        </Button>
                    </div>
                    {/* Botón eliminar */}
                    <Button type="button" size="sm" variant="destructive" onClick={handleRemove}>
                        <X className="w-4 h-4 mr-1"/> Eliminar
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div
                {...getRootProps()}
                className={`
                    flex flex-col items-center justify-center w-full h-40 rounded-lg border-2 border-dashed cursor-pointer transition-colors
                    ${isDragActive
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/50'}
                    ${error ? 'border-red-500' : ''}
                `}
            >
                <input {...getInputProps()} />
                <ImageIcon className="w-8 h-8 mb-2 text-muted-foreground"/>
                <p className="text-sm text-muted-foreground text-center px-4">
                    {isDragActive
                        ? 'Suelta la imagen aquí...'
                        : 'Arrastra una imagen o haz clic para seleccionar'}
                </p>
            </div>
            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}

export default ImageDropzone;