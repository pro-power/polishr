// src/lib/templates/minimal.tsx

import React from 'react'
import { TemplateProps } from './template-types'
import { Github, Linkedin, ExternalLink, Mail, MapPin, Download, Twitter } from 'lucide-react'

export const MinimalTemplate: React.FC<TemplateProps> = ({
  user,
  projects,
  skills,
  experience,
  theme,
  config
}) => {
  // Apply theme CSS variables as inline styles
  const themeStyles = {
    '--primary': theme.palette.primary,
    '--secondary': theme.palette.secondary,
    '--accent': theme.palette.accent,
    '--background': theme.palette.background,
    '--surface': theme.palette.surface,
    '--surface-variant': theme.palette.surfaceVariant,
    '--text-primary': theme.palette.text.primary,
    '--text-secondary': theme.palette.text.secondary,
    '--text-muted': theme.palette.text.muted,
    '--border': theme.palette.border,
    '--radius': theme.borderRadius,
    '--font-heading': theme.fonts.heading,
    '--font-body': theme.fonts.body,
    '--font-mono': theme.fonts.mono,
    '--shadow-sm': theme.shadows.sm,
    '--shadow-md': theme.shadows.md,
    '--shadow-lg': theme.shadows.lg,
  } as React.CSSProperties

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'other'
    if (!acc[category]) acc[category] = []
    acc[category].push(skill)
    return acc
  }, {} as Record<string, typeof skills>)

  // Sort experience by start date (most recent first)
  const sortedExperience = [...experience].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1
    if (!a.isCurrent && b.isCurrent) return 1
    if (!a.startDate || !b.startDate) return 0
    return new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  })

  // Get featured projects first, then others
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured && !b.featured) return -1
    if (!a.featured && b.featured) return 1
    return 0
  })

  const formatDate = (date: Date | null) => {
    if (!date) return ''
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short' 
    }).format(new Date(date))
  }

  return (
    <div 
      style={{
        ...themeStyles,
        fontFamily: 'Inter, system-ui, sans-serif',
        color: theme.palette.text.primary,
        background: theme.palette.background,
        minHeight: '100vh',
        lineHeight: '1.6'
      }}
    >
      <div 
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          padding: '2rem 1rem'
        }}
      >
        {/* Header Section */}
        <header 
          style={{
            textAlign: 'center',
            marginBottom: '3rem',
            padding: '2rem 0'
          }}
        >
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.displayName || 'Profile'}
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                margin: '0 auto 1.5rem',
                border: `3px solid ${theme.palette.primary}`,
                objectFit: 'cover',
                display: 'block'
              }}
            />
          )}
          
          <h1 
            style={{
              fontFamily: theme.fonts.heading,
              fontSize: '2.5rem',
              fontWeight: '700',
              margin: '0 0 0.5rem',
              color: theme.palette.text.primary
            }}
          >
            {user.displayName || 'Your Name'}
          </h1>
          
          {user.jobTitle && (
            <p 
              style={{
                fontSize: '1.25rem',
                color: theme.palette.primary,
                margin: '0 0 1rem',
                fontWeight: '500'
              }}
            >
              {user.jobTitle}
            </p>
          )}
          
          {user.bio && (
            <p 
              style={{
                fontSize: '1.1rem',
                color: theme.palette.text.secondary,
                maxWidth: '600px',
                margin: '0 auto 2rem'
              }}
            >
              {user.bio}
            </p>
          )}

          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              flexWrap: 'wrap',
              marginBottom: '2rem'
            }}
          >
            {user.location && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: theme.palette.text.muted,
                  fontSize: '0.9rem'
                }}
              >
                <MapPin size={16} />
                <span>{user.location}</span>
              </div>
            )}
            
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: theme.palette.text.muted,
                fontSize: '0.9rem'
              }}
            >
              <Mail size={16} />
              <span>{user.email}</span>
            </div>
            
            {user.lookingForWork && (
              <div 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: theme.palette.accent,
                  fontSize: '0.9rem'
                }}
              >
                <span>🟢 Open to opportunities</span>
              </div>
            )}
          </div>

          <div 
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              flexWrap: 'wrap'
            }}
          >
            {user.resumeUrl && (
              <a 
                href={user.resumeUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: theme.palette.surface,
                  border: `1px solid ${theme.palette.border}`,
                  borderRadius: theme.borderRadius,
                  color: theme.palette.text.secondary,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Download size={16} />
                Resume
              </a>
            )}
            
            {user.githubUrl && (
              <a 
                href={user.githubUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: theme.palette.surface,
                  border: `1px solid ${theme.palette.border}`,
                  borderRadius: theme.borderRadius,
                  color: theme.palette.text.secondary,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Github size={16} />
                GitHub
              </a>
            )}
            
            {user.linkedinUrl && (
              <a 
                href={user.linkedinUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: theme.palette.surface,
                  border: `1px solid ${theme.palette.border}`,
                  borderRadius: theme.borderRadius,
                  color: theme.palette.text.secondary,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Linkedin size={16} />
                LinkedIn
              </a>
            )}
            
            {user.twitterUrl && (
              <a 
                href={user.twitterUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: theme.palette.surface,
                  border: `1px solid ${theme.palette.border}`,
                  borderRadius: theme.borderRadius,
                  color: theme.palette.text.secondary,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Twitter size={16} />
                Twitter
              </a>
            )}
            
            {user.website && (
              <a 
                href={user.website} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: theme.palette.surface,
                  border: `1px solid ${theme.palette.border}`,
                  borderRadius: theme.borderRadius,
                  color: theme.palette.text.secondary,
                  fontSize: '0.9rem',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <ExternalLink size={16} />
                Website
              </a>
            )}
          </div>
        </header>

        {/* Projects Section */}
        {sortedProjects.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: '1.75rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: theme.palette.text.primary,
                borderBottom: `2px solid ${theme.palette.primary}`,
                paddingBottom: '0.5rem'
              }}
            >
              Featured Projects
            </h2>
            
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {sortedProjects.slice(0, 6).map((project) => (
                <div 
                  key={project.id} 
                  style={{
                    background: theme.palette.surface,
                    border: `1px solid ${theme.palette.border}`,
                    borderRadius: theme.borderRadius,
                    padding: '1.5rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <h3 
                    style={{
                      fontSize: '1.25rem',
                      fontWeight: '600',
                      marginBottom: '0.5rem',
                      color: theme.palette.text.primary
                    }}
                  >
                    {project.title}
                  </h3>
                  
                  {project.description && (
                    <p 
                      style={{
                        color: theme.palette.text.secondary,
                        marginBottom: '1rem',
                        lineHeight: '1.5'
                      }}
                    >
                      {project.description}
                    </p>
                  )}
                  
                  {project.techStack.length > 0 && (
                    <div 
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem',
                        marginBottom: '1rem'
                      }}
                    >
                      {project.techStack.map((tech, index) => (
                        <span 
                          key={index} 
                          style={{
                            background: theme.palette.surfaceVariant,
                            color: theme.palette.text.muted,
                            padding: '0.25rem 0.75rem',
                            borderRadius: '9999px',
                            fontSize: '0.8rem',
                            fontWeight: '500'
                          }}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div 
                    style={{
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    {project.demoUrl && (
                      <a 
                        href={project.demoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          background: theme.palette.primary,
                          color: 'white',
                          borderRadius: theme.borderRadius,
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                    )}
                    
                    {project.repoUrl && (
                      <a 
                        href={project.repoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          padding: '0.5rem 1rem',
                          background: theme.palette.surface,
                          color: theme.palette.text.secondary,
                          border: `1px solid ${theme.palette.border}`,
                          borderRadius: theme.borderRadius,
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          textDecoration: 'none',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <Github size={16} />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: '1.75rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: theme.palette.text.primary,
                borderBottom: `2px solid ${theme.palette.primary}`,
                paddingBottom: '0.5rem'
              }}
            >
              Skills & Technologies
            </h2>
            
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '1.5rem'
              }}
            >
              {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                <div 
                  key={category} 
                  style={{
                    background: theme.palette.surface,
                    border: `1px solid ${theme.palette.border}`,
                    borderRadius: theme.borderRadius,
                    padding: '1.5rem'
                  }}
                >
                  <h3 
                    style={{
                      fontSize: '1.1rem',
                      fontWeight: '600',
                      marginBottom: '1rem',
                      color: theme.palette.primary,
                      textTransform: 'capitalize'
                    }}
                  >
                    {category.replace('-', ' ')}
                  </h3>
                  
                  <div 
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem'
                    }}
                  >
                    {categorySkills.map((skill) => (
                      <div 
                        key={skill.id} 
                        style={{
                          background: theme.palette.surfaceVariant,
                          padding: '0.5rem 1rem',
                          borderRadius: theme.borderRadius,
                          fontSize: '0.9rem',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem'
                        }}
                      >
                        <div 
                          style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: 
                              skill.skillLevel === 'beginner' ? '#f59e0b' :
                              skill.skillLevel === 'intermediate' ? '#10b981' :
                              skill.skillLevel === 'advanced' ? '#3b82f6' : '#8b5cf6'
                          }}
                        />
                        <span>{skill.skillName}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {sortedExperience.length > 0 && (
          <section style={{ marginBottom: '3rem' }}>
            <h2 
              style={{
                fontFamily: theme.fonts.heading,
                fontSize: '1.75rem',
                fontWeight: '600',
                marginBottom: '1.5rem',
                color: theme.palette.text.primary,
                borderBottom: `2px solid ${theme.palette.primary}`,
                paddingBottom: '0.5rem'
              }}
            >
              Experience & Education
            </h2>
            
            <div 
              style={{
                position: 'relative',
                paddingLeft: '2rem'
              }}
            >
              {/* Timeline line */}
              <div 
                style={{
                  position: 'absolute',
                  left: '0.75rem',
                  top: '0',
                  bottom: '0',
                  width: '2px',
                  background: theme.palette.border
                }}
              />
              
              {sortedExperience.map((exp) => (
                <div 
                  key={exp.id} 
                  style={{
                    position: 'relative',
                    marginBottom: '2rem',
                    paddingLeft: '2rem'
                  }}
                >
                  {/* Timeline dot */}
                  <div 
                    style={{
                      position: 'absolute',
                      left: '-0.5rem',
                      top: '0.5rem',
                      width: '12px',
                      height: '12px',
                      borderRadius: '50%',
                      background: theme.palette.primary,
                      border: `3px solid ${theme.palette.background}`
                    }}
                  />
                  
                  <div style={{ marginBottom: '0.5rem' }}>
                    <h3 
                      style={{
                        fontSize: '1.1rem',
                        fontWeight: '600',
                        color: theme.palette.text.primary,
                        margin: '0'
                      }}
                    >
                      {exp.title}
                    </h3>
                    
                    <p 
                      style={{
                        color: theme.palette.primary,
                        fontWeight: '500',
                        margin: '0.25rem 0'
                      }}
                    >
                      {exp.organization}
                    </p>
                    
                    <div 
                      style={{
                        color: theme.palette.text.muted,
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        flexWrap: 'wrap'
                      }}
                    >
                      <span>
                        {formatDate(exp.startDate)} - {exp.isCurrent ? 'Present' : formatDate(exp.endDate)}
                      </span>
                      {exp.isCurrent && (
                        <span 
                          style={{
                            background: theme.palette.accent,
                            color: 'white',
                            padding: '0.125rem 0.5rem',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: '500'
                          }}
                        >
                          Current
                        </span>
                      )}
                      {exp.location && (
                        <>
                          <span>•</span>
                          <span>{exp.location}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  {exp.description && (
                    <p 
                      style={{
                        color: theme.palette.text.secondary,
                        marginTop: '0.5rem',
                        lineHeight: '1.5'
                      }}
                    >
                      {exp.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}