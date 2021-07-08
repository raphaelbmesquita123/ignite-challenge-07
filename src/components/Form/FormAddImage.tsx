import { Box, Button, Stack, useToast } from '@chakra-ui/react';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';

import { api } from '../../services/api';
import { FileInput } from '../Input/FileInput';
import { TextInput } from '../Input/TextInput';

interface FormAddImageProps {
  closeModal: () => void;
}

export function FormAddImage({ closeModal }: FormAddImageProps): JSX.Element {
  const [imageUrl, setImageUrl] = useState('');
  const [localImageUrl, setLocalImageUrl] = useState('');
  const toast = useToast();

  const formValidations = {
    image: {
      required: true,
      // validate: {
      //   size: s => s < 10,
      // }

    },
    title: {
      required: true,
      minLength: 2,
      maxLength: 20,
    },
    description: {
      required: true,
      maxLength: 65
    },
  };

  const queryClient = useQueryClient();
  
  const mutation = useMutation(
    async () => {
      // TODO MUTATION API POST REQUEST,
      await api.post('api/images')
    },
    {
      // TODO ONSUCCESS MUTATION
      onSuccess: () => {
        queryClient.invalidateQueries('todos')
      },
    }
  );

  const {
    register,
    handleSubmit,
    reset,
    formState,
    setError,
    trigger,
  } = useForm();
  const { errors } = formState;

  const onSubmit = async (data: Record<string, unknown>): Promise<void> => {
    try {
      if( !imageUrl ){
        // TODO SHOW ERROR TOAST IF IMAGE URL DOES NOT EXISTS
        toast({
          title: 'Imagem não adicionada',
          description: 'É preciso adicionar e aguardar o upload de uma imagem antes de realizar o cadastro',
          duration: 9000,
          isClosable: true,
        })
      } else {
        // TODO EXECUTE ASYNC MUTATION
        const image = async () => await mutation;
        image()

        // TODO SHOW SUCCESS TOAST
        toast({
          title: 'Imagem cadastrada',
          description: 'Sua imagem foi cadastrada com sucesso.',
          duration: 9000,
          isClosable: true,
        })
      }
    } catch {
      // TODO SHOW ERROR TOAST IF SUBMIT FAILED
      toast({
        title: 'Falha no cadastro',
        description: 'Ocorreu um erro ao tentar cadastrar a sua imagem.',
        duration: 9000,
        isClosable: true,
      })
    } finally {
      reset()
      setImageUrl('')
      setLocalImageUrl('')
      closeModal()
    }
  };

  return (
    <Box as="form" width="100%" onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={4}>
        <FileInput
          setImageUrl={setImageUrl}
          localImageUrl={localImageUrl}
          setLocalImageUrl={setLocalImageUrl}
          setError={setError}
          trigger={trigger}
          {...register("image", formValidations['image'])}
          error={errors.image}
          />
          {errors.image && errors.image.type === 'required' && <p>Arquivo obrigatório</p>}

        <TextInput
          placeholder="Título da imagem..."
          name='title'
          error={errors.title}
          {...register("title", formValidations['title'])}
          />
        {errors.title && errors.title.type === 'required' && <p>Título obrigatório</p>}
        {errors.title && errors.title.type === 'minLength' && <p>Mínimo de 2 caracteres</p>}
        {errors.title && errors.title.type === 'maxLength' && <p>Máximo de 20 caracteres</p>}

        <TextInput
          placeholder="Descrição da imagem..."
          name='description'
          error={errors.description}
          {...register("description", formValidations['description'])}
        />
        {errors.description && errors.description.type === 'required' && <p>Descrição obrigatória</p>}
        {errors.description && errors.description.type === 'maxLength' && <p>Máximo de 65 caracteres</p>}
      </Stack>

      <Button
        my={6}
        isLoading={formState.isSubmitting}
        isDisabled={formState.isSubmitting}
        type="submit"
        w="100%"
        py={6}
      >
        Enviar
      </Button>
    </Box>
  );
}
