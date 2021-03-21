import { useState, useEffect } from 'react'

import Header from '../../components/Header'
import api from '../../services/api'
import Food from '../../components/Food'
import ModalAddFood from '../../components/ModalAddFood'
import ModalEditFood from '../../components/ModalEditFood'
import { FoodsContainer } from './styles'

import { FoodType } from '../../types/food'

const Dashboard = () => {
  const [foods, setFoods] = useState<FoodType[]>([])
  const [editingFood, setEditingFood] = useState<FoodType>({} as FoodType)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false)

  useEffect(() => {
    api.get('/foods').then(response => response.data)
  }, [])

  const handleAddFood = (food: FoodType) => {
    try {
      api.post('/foods', { ...food, available: true })
        .then(response => setFoods([...foods, response.data]))
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdateFood = (newFood: FoodType) => {
    try {
      api.put(`/foods/${editingFood.id}`,
        { ...editingFood, ...newFood },
      ).then(response => {
        setFoods(foods.map(food =>
          food.id !== response.data.id ?
          food :
          response.data,
        ))
      })
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteFood = (id: number) => {
    api.delete(`/foods/${id}`)
      .then(_ => setFoods(foods.filter(food => food.id !== id)))
  }

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen)
  }

  const toggleEditModal = () => {
    setIsEditModalOpen(!isEditModalOpen)
  }

  const handleEditFood = (food: FoodType) => {
    setEditingFood(food)
    setIsEditModalOpen(true)
  }

  return (
    <>
      <Header onOpenModal={toggleModal} />
      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}

export default Dashboard
