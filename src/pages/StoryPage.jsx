import Layout from '../components/Layout';

const StoryPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">The GroundPlay Story</h1>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="h-64 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white">About the Project</h2>
          </div>
          
          <div className="p-8">
            <div className="prose prose-lg max-w-none space-y-6">
              <p className="lead text-xl">
                GroundPlay is a platform that helps sports enthusiasts find and organize local games.
              </p>
              
              <p>
                As a sports lover in a new city, I struggled to find enough players for weekend games. 
                Group chats would get chaotic, plans would fall through, and we'd often end up with too few 
                players or confusion about time and location. After experiencing this frustration repeatedly, 
                I began to wonder if there was a better way to organize local sports games.
              </p>
              
              <p>
                That's when the idea for GroundPlay was born—a concept for a community-driven platform where 
                sports enthusiasts could create, find, and join local games with minimal friction. The vision 
                was to create something that felt light, accessible, and fun—removing the barriers that kept 
                people from enjoying sports with others in their community.
              </p>
              
              <p>
                With GroundPlay, players can find nearby pickup games based on location, create and manage 
                their own games, and easily join or leave activities with just one click. The platform provides 
                clear details about game location, time, required players, and current enrollment status. Users 
                can browse games by sport type and proximity, while managing their player profile and game history.
              </p>
              
              <p>
                Building GroundPlay has been a journey of learning and iteration. As my personal hobby project, 
                it's been developed with a focus on solving real problems while helping me improve my coding skills. 
                The application uses modern web technologies, focusing on responsive design that works well on both 
                desktop and mobile devices—because people need to check game details when they're on the go.
              </p>
              
              <p>
                The project is currently a prototype to demonstrate the concept, built as a personal learning 
                exercise to explore location-based services and modern web technologies. Through this project, 
                I've deepened my understanding of React and backend development with 
                Kotlin and Spring Boot.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="h-64 bg-gradient-to-r from-secondary to-accent flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white">Technical Implementation</h2>
          </div>
          
          <div className="p-8">
            <div className="prose prose-lg max-w-none space-y-6">              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-3">Frontend</h4>
                  <ul className="space-y-2">
                    <li>React with functional components</li>
                    <li>Tailwind CSS for styling</li>
                    <li>Context API for state management</li>
                    <li>Vite for fast development</li>
                    <li>React Router for navigation</li>
                    <li>JWT authentication</li>
                    <li>Leaflet for interactive maps</li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-bold mb-3">Backend</h4>
                  <ul className="space-y-2">
                    <li>Kotlin with Spring Boot</li>
                    <li>Spring Security with JWT</li>
                    <li>Spring Data JPA</li>
                    <li>PostgreSQL with PostGIS</li>
                    <li>JTS Topology Suite</li>
                    <li>Role-based access control</li>
                    <li>Gradle build system</li>
                  </ul>
                </div>
              </div>
              
              <h3 className="text-2xl font-bold mt-6 mb-4">Key Features Implementation</h3>
              
              <h4 className="text-xl font-bold mb-2">Location-Based Game Discovery</h4>
              <p>
                Uses PostGIS spatial queries to find games within a specified radius of the user's location. 
                The frontend captures user coordinates via browser geolocation API and displays results on an 
                interactive map using Leaflet.
              </p>
              
              <h4 className="text-xl font-bold mt-4 mb-2">Game Management</h4>
              <p>
                Implemented a system for creating games with location, time, and player requirements. 
                Games have different statuses (upcoming, in-progress, completed) and track enrollment with capacity limits.
              </p>
              
              <h4 className="text-xl font-bold mt-4 mb-2">Authentication System</h4>
              <p>
                Secure JWT-based authentication provides identity management and authorizes access to resources.
                Tokens contain user roles for fine-grained permissions control.
              </p>
              
              <p className="text-lg font-semibold italic mt-8">
                This project serves as a personal learning playground, combining my interests in sports
                and modern web development.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StoryPage;