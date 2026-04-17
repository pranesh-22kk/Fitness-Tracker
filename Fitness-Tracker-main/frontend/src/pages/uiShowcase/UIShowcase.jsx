/**
 * UI Showcase Page - Demonstrates all available components
 * This page can be used for testing and reference
 * Path: src/pages/uiShowcase/UIShowcase.jsx
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/navbar/navbar';
import {
  StatCard,
  DataCard,
  FormInput,
  GradientButton,
  Modal,
  LoadingSpinner
} from '../../components/common';
import {
  FiActivity,
  FiCoffee,
  FiTarget,
  FiTrendingUp,
  FiSave,
  FiSettings,
  FiPlus,
  FiMail,
  FiLock,
  FiUser
} from 'react-icons/fi';
import './UIShowcase.scss';

const UIShowcase = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    alert('Form submitted!');
  };

  return (
    <>
      <Navbar />
      <div className="ui-showcase">
        <div className="container ui-showcase__container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Hero Section */}
            <section className="showcase-section">
              <h1 className="heading-1">UI Components Showcase</h1>
              <p className="text-muted">
                Explore all available components and design elements
              </p>
            </section>

            {/* Stat Cards Section */}
            <section className="showcase-section">
              <h2 className="heading-2">Stat Cards</h2>
              <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                Metrics display cards with optional trend indicators
              </p>
              <div className="grid grid-4">
                <StatCard
                  title="Daily Steps"
                  value="12,450"
                  icon={FiActivity}
                  subtitle="steps today"
                  trend={{ value: '+5%', direction: 'up' }}
                  color="primary"
                  delay={0}
                />
                <StatCard
                  title="Calories"
                  value="2,450"
                  icon={FiCoffee}
                  subtitle="kcal burned"
                  trend={{ value: '-2%', direction: 'down' }}
                  color="danger"
                  delay={0.1}
                />
                <StatCard
                  title="Workout Time"
                  value="45 min"
                  icon={FiTarget}
                  subtitle="completed"
                  trend={{ value: '+15%', direction: 'up' }}
                  color="success"
                  delay={0.2}
                />
                <StatCard
                  title="Progress"
                  value="78%"
                  icon={FiTrendingUp}
                  subtitle="weekly goal"
                  trend={{ value: '+8%', direction: 'up' }}
                  color="info"
                  delay={0.3}
                />
              </div>

              {/* Glass Cards */}
              <div style={{ marginTop: '2rem' }}>
                <p className="text-secondary text-sm">With Glassmorphism</p>
                <div className="grid grid-4" style={{ marginTop: '1rem' }}>
                  <StatCard
                    title="Heart Rate"
                    value="72 BPM"
                    icon={FiActivity}
                    isGlass
                    color="primary"
                    delay={0}
                  />
                  <StatCard
                    title="Water Intake"
                    value="2.5L"
                    icon={FiTarget}
                    isGlass
                    color="info"
                    delay={0.1}
                  />
                  <StatCard
                    title="Sleep"
                    value="7h 30m"
                    icon={FiCoffee}
                    isGlass
                    color="success"
                    delay={0.2}
                  />
                  <StatCard
                    title="Streak"
                    value="24 days"
                    icon={FiTrendingUp}
                    isGlass
                    color="warning"
                    delay={0.3}
                  />
                </div>
              </div>
            </section>

            {/* Data Cards Section */}
            <section className="showcase-section">
              <h2 className="heading-2">Data Cards</h2>
              <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                Flexible cards for displaying detailed information
              </p>
              <div className="grid grid-2">
                <DataCard
                  title="Today's Workout"
                  icon={<FiActivity size={24} style={{ color: 'var(--accent-primary)' }} />}
                  variant="elevated"
                  footer="Completed at 6:30 PM"
                >
                  <ul style={{ lineHeight: '2' }}>
                    <li>🏃 Running - 30 minutes</li>
                    <li>💪 Weight Training - 20 minutes</li>
                    <li>🧘 Stretching - 10 minutes</li>
                  </ul>
                </DataCard>

                <DataCard
                  title="Nutrition Summary"
                  icon={<FiCoffee size={24} style={{ color: 'var(--accent-danger)' }} />}
                  variant="gradient"
                  footer="Track meals for accurate data"
                >
                  <div className="data-summary">
                    <div>Protein: <strong>120g</strong></div>
                    <div>Carbs: <strong>200g</strong></div>
                    <div>Fats: <strong>60g</strong></div>
                  </div>
                </DataCard>

                <DataCard
                  title="Weekly Goals"
                  icon={<FiTarget size={24} style={{ color: 'var(--accent-success)' }} />}
                  variant="default"
                >
                  <div className="goal-progress">
                    <div className="goal-item">
                      <div className="flex flex-between gap-md">
                        <span>Steps</span>
                        <span>78%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '78%' }}></div>
                      </div>
                    </div>
                    <div className="goal-item">
                      <div className="flex flex-between gap-md">
                        <span>Workouts</span>
                        <span>100%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: '100%' }}></div>
                      </div>
                    </div>
                  </div>
                </DataCard>

                <DataCard
                  title="Recent Activity"
                  icon={<FiTrendingUp size={24} style={{ color: 'var(--accent-info)' }} />}
                  variant="glass"
                  action={<FiSettings size={20} style={{ cursor: 'pointer' }} />}
                >
                  <div style={{ fontSize: 'var(--text-sm)', lineHeight: '1.8' }}>
                    <div>📝 Updated meal plan</div>
                    <div>🏃 Completed run (5K)</div>
                    <div>📊 Reviewed stats</div>
                  </div>
                </DataCard>
              </div>
            </section>

            {/* Form Inputs Section */}
            <section className="showcase-section">
              <h2 className="heading-2">Form Inputs</h2>
              <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                Modern form input with validation and icons
              </p>
              <div className="container-sm">
                <FormInput
                  label="Full Name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  icon={FiUser}
                  required
                />

                <FormInput
                  label="Email Address"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  icon={FiMail}
                  required
                  helpText="We'll never share your email"
                />

                <FormInput
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  icon={FiLock}
                  required
                />

                <FormInput
                  label="Invalid Input"
                  placeholder="This shows error state"
                  error="This field is required"
                  icon={FiMail}
                />
              </div>
            </section>

            {/* Buttons Section */}
            <section className="showcase-section">
              <h2 className="heading-2">Buttons</h2>
              <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                Various button styles and states
              </p>

              <div style={{ marginBottom: '2rem' }}>
                <p className="text-secondary text-sm">Primary Buttons</p>
                <div className="button-group">
                  <GradientButton variant="primary" size="sm">
                    Small
                  </GradientButton>
                  <GradientButton variant="primary" size="md" icon={FiSave}>
                    Medium
                  </GradientButton>
                  <GradientButton variant="primary" size="lg">
                    Large
                  </GradientButton>
                </div>
              </div>

              <div style={{ marginBottom: '2rem' }}>
                <p className="text-secondary text-sm">Variants</p>
                <div className="button-group">
                  <GradientButton variant="primary">Primary</GradientButton>
                  <GradientButton variant="secondary">Secondary</GradientButton>
                  <GradientButton variant="success" icon={FiSave}>
                    Success
                  </GradientButton>
                  <GradientButton variant="danger">Danger</GradientButton>
                  <GradientButton variant="ghost">Ghost</GradientButton>
                </div>
              </div>

              <div>
                <p className="text-secondary text-sm">Loading & Disabled</p>
                <div className="button-group">
                  <GradientButton
                    isLoading={isLoading}
                    onClick={handleSubmit}
                  >
                    {isLoading ? 'Loading...' : 'Click to Load'}
                  </GradientButton>
                  <GradientButton disabled>Disabled</GradientButton>
                </div>
              </div>
            </section>

            {/* Badges Section */}
            <section className="showcase-section">
              <h2 className="heading-2">Badges</h2>
              <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                Status and category indicators
              </p>
              <div className="flex gap-md flex-wrap">
                <span className="badge">Default</span>
                <span className="badge badge-success">✓ Completed</span>
                <span className="badge badge-warning">⚠ In Progress</span>
                <span className="badge badge-danger">✕ Failed</span>
              </div>
            </section>

            {/* Modal Section */}
            <section className="showcase-section">
              <h2 className="heading-2">Modal</h2>
              <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                Overlay dialog with animations
              </p>
              <GradientButton onClick={() => setIsModalOpen(true)} variant="primary">
                Open Modal
              </GradientButton>

              <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Welcome!"
                size="md"
                footer={
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <GradientButton
                      variant="ghost"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </GradientButton>
                    <GradientButton
                      onClick={() => setIsModalOpen(false)}
                    >
                      Confirm
                    </GradientButton>
                  </div>
                }
              >
                <p>This is a modal dialog with smooth animations and backdrop control.</p>
                <p>You can customize the size, content, and actions.</p>
              </Modal>
            </section>

            {/* Loading Spinner Section */}
            <section className="showcase-section">
              <h2 className="heading-2">Loading Spinner</h2>
              <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                Animated loading indicators
              </p>
              <div className="flex gap-2xl flex-center">
                <div className="flex flex-col flex-center">
                  <LoadingSpinner size="sm" />
                  <p className="text-xs" style={{ marginTop: '1rem' }}>Small</p>
                </div>
                <div className="flex flex-col flex-center">
                  <LoadingSpinner size="md" />
                  <p className="text-xs" style={{ marginTop: '1rem' }}>Medium</p>
                </div>
                <div className="flex flex-col flex-center">
                  <LoadingSpinner size="lg" />
                  <p className="text-xs" style={{ marginTop: '1rem' }}>Large</p>
                </div>
              </div>
            </section>

            {/* Typography Section */}
            <section className="showcase-section">
              <h2 className="heading-2">Typography</h2>
              <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                Consistent text styles throughout the app
              </p>
              <h1 className="heading-1">Heading 1 - 2.25rem</h1>
              <h2 className="heading-2">Heading 2 - 1.875rem</h2>
              <h3 className="heading-3">Heading 3 - 1.5rem</h3>
              <h4 className="heading-4">Heading 4 - 1.25rem</h4>
              <p>Regular paragraph text - 1rem</p>
              <p className="text-sm">Small text - 0.875rem</p>
              <p className="text-xs">Extra small text - 0.75rem</p>
              <p className="text-muted">Muted text color</p>
            </section>

            {/* Grid Layout Section */}
            <section className="showcase-section">
              <h2 className="heading-2">Responsive Grid</h2>
              <p className="text-secondary" style={{ marginBottom: '2rem' }}>
                Flexible grid system that adapts to screen size
              </p>
              <div className="grid grid-3">
                <div className="demo-box">Grid Item 1</div>
                <div className="demo-box">Grid Item 2</div>
                <div className="demo-box">Grid Item 3</div>
              </div>
            </section>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default UIShowcase;
