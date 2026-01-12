/**
 * Common UI Components Demo
 * 
 * This file demonstrates the usage of all common components
 * with proper TypeScript typing and Tailwind CSS styling.
 */

import React, { useState } from 'react'
import {
  Button,
  Modal,
  Input,
  Select,
  SelectOption,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Loading,
  Skeleton,
} from './index'

export const CommonComponentsDemo: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedValue, setSelectedValue] = useState<string | number>('')

  const selectOptions: SelectOption[] = [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' },
    { value: 'option3', label: 'Option 3' },
  ]

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-secondary-900">
        Common UI Components
      </h1>

      {/* Button Examples */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-secondary-900">
            Buttons
          </h2>
        </CardHeader>
        <CardBody className="flex flex-wrap gap-4">
          <Button variant="primary">Primary Button</Button>
          <Button variant="secondary">Secondary Button</Button>
          <Button variant="danger">Danger Button</Button>
          <Button variant="ghost">Ghost Button</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button
            isLoading={isLoading}
            onClick={() => {
              setIsLoading(true)
              setTimeout(() => setIsLoading(false), 2000)
            }}
          >
            Loading Button
          </Button>
        </CardBody>
      </Card>

      {/* Modal Example */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-secondary-900">
            Modal
          </h2>
        </CardHeader>
        <CardBody>
          <Button onClick={() => setIsModalOpen(true)}>Open Modal</Button>
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Example Modal"
            size="md"
          >
            <p className="text-secondary-700 mb-4">
              This is a modal dialog component with proper accessibility
              features and smooth animations.
            </p>
            <div className="flex gap-2">
              <Button
                variant="primary"
                onClick={() => setIsModalOpen(false)}
              >
                Confirm
              </Button>
              <Button
                variant="secondary"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </Modal>
        </CardBody>
      </Card>

      {/* Input Example */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-secondary-900">
            Input
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            helperText="We'll never share your email"
          />
          <Input
            label="Username"
            type="text"
            placeholder="Choose a username"
            error="Username already taken"
          />
          <Input
            label="Disabled Input"
            type="text"
            placeholder="This is disabled"
            disabled
          />
        </CardBody>
      </Card>

      {/* Select Example */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-secondary-900">
            Select
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Select
            label="Choose an option"
            options={selectOptions}
            value={selectedValue}
            onChange={setSelectedValue}
            helperText="Select your preferred option"
          />
          <Select
            label="Disabled Select"
            options={selectOptions}
            disabled
          />
        </CardBody>
      </Card>

      {/* Card with Sections */}
      <Card className="mb-6" hover>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-secondary-900">
            Card Sections
          </h2>
        </CardHeader>
        <CardBody>
          <p className="text-secondary-700 mb-4">
            Cards can have headers, body, and footer sections with proper
            spacing and borders.
          </p>
        </CardBody>
        <CardFooter>
          <Button variant="primary" size="sm">
            Learn More
          </Button>
        </CardFooter>
      </Card>

      {/* Loading Spinner */}
      <Card className="mb-6">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-secondary-900">
            Loading States
          </h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <p className="text-sm font-medium text-secondary-700 mb-4">
              Small Spinner
            </p>
            <Loading size="sm" label="Loading..." />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-700 mb-4">
              Medium Spinner
            </p>
            <Loading size="md" label="Processing..." />
          </div>
          <div>
            <p className="text-sm font-medium text-secondary-700 mb-4">
              Skeleton Loader
            </p>
            <Skeleton count={3} height="1rem" />
          </div>
        </CardBody>
      </Card>

      {/* Skeleton Example */}
      <Card className="mb-6">
        <CardHeader>
          <Skeleton height="2rem" />
        </CardHeader>
        <CardBody>
          <Skeleton count={3} height="1rem" className="mb-4" />
          <Skeleton circle height="3rem" />
        </CardBody>
      </Card>
    </div>
  )
}

export default CommonComponentsDemo
