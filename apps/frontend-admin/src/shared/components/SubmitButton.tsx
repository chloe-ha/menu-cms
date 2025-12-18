import { Button, type ButtonProps } from 'antd';
import React from 'react'

type SubmitButtonProps = ButtonProps;

const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const {
    loading,
    ...rest
  } = props;

  return (
    <Button
      htmlType="submit"
      size="large"
      type="primary"
      loading={loading}
      {...rest}
    >
      {loading ? "Sauvegarde..." : "Enregistrer"}
    </Button>
  )
}

export default SubmitButton