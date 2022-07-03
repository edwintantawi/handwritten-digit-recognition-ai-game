import { useCallback, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';

const useTensorflowModel = (path: string) => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);

  const loadModel = useCallback(async () => {
    try {
      const model = await tf.loadLayersModel(path);
      setModel(model);
    } catch (error) {
      console.error(error);
    }
  }, [path]);

  useEffect(() => {
    loadModel();
  }, [loadModel]);

  const predict = async (input: number[]) => {
    try {
      const TENSOR_SHAPE = [1, 28, 28, 1];
      const tensorImage = [tf.tensor(input).reshape(TENSOR_SHAPE)];

      const results = (await (
        model?.predict(tensorImage) as tf.Tensor
      ).array()) as any;

      if (!results?.length) return;

      const scores = results[0] as number[];
      const predicted = scores.indexOf(Math.max(...scores));

      return predicted;
    } catch (error) {
      console.error(error);
    }
  };

  return { predict };
};

export { useTensorflowModel };
