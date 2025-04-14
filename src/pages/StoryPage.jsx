import Layout from '../components/Layout';

const StoryPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">The GroundPlay Story</h1>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-12">
          <div className="h-64 bg-gradient-to-r from-primary to-accent flex items-center justify-center">
            <h2 className="text-3xl font-bold text-white">How It All Began</h2>
          </div>
          
          <div className="p-8">
            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl">
                GroundPlay started from a simple problem: finding enough players for a casual weekend cricket match.
              </p>
              
              <p>
                As an avid sports enthusiast living in a new city, I often found myself struggling to gather enough players for a casual cricket match on weekends. Group chats would get chaotic, plans would fall through, and we'd end up with either too few players or miscommunications about time and location.
              </p>
              
              <p>
                After experiencing this frustration repeatedly, I began to wonder if there was a better way to organize local sports games. I wanted something that would make it easy to:
              </p>
              
              <ul>
                <li>Find players interested in the same sports</li>
                <li>Organize games with clear details about location, time, and required players</li>
                <li>Allow people to easily join (or leave) games</li>
                <li>Discover nearby games when I was free to play</li>
              </ul>
              
              <p>
                I looked for existing solutions but couldn't find anything that felt just right. Most platforms were either too focused on competitive leagues or too general as social networks. There wasn't a dedicated, easy-to-use platform specifically for organizing casual sports games.
              </p>
              
              <p>
                That's when the idea for GroundPlay was born—a community-driven platform where sports enthusiasts could create, find, and join local games with minimal friction.
              </p>
              
              <h3 className="text-2xl font-bold mt-8 mb-4">Building the Vision</h3>
              
              <p>
                I started by sketching out the core features I wanted in the platform:
              </p>
              
              <ul>
                <li>A clean, intuitive interface that puts the focus on the games</li>
                <li>Location-based discovery so players could find games nearby</li>
                <li>Simple enrollment/unenrollment to manage participation</li>
                <li>Support for various sports, starting with the most popular ones</li>
              </ul>
              
              <p>
                The goal was to create something that felt light, accessible, and fun—removing the barriers that kept people from enjoying sports with others in their community.
              </p>
              
              <h3 className="text-2xl font-bold mt-8 mb-4">From Idea to Reality</h3>
              
              <p>
                Building GroundPlay has been a journey of learning and iteration. As a hobby project, it's been developed with a focus on solving real problems rather than chasing trends or metrics.
              </p>
              
              <p>
                The platform was built with modern web technologies, focusing on responsive design that works well on both desktop and mobile devices—because people need to check game details when they're on the go.
              </p>
              
              <p>
                Early feedback from friends who tested the platform helped shape its features and user experience. Their input was invaluable in creating something that truly serves the needs of casual sports players.
              </p>
              
              <h3 className="text-2xl font-bold mt-8 mb-4">The Road Ahead</h3>
              
              <p>
                GroundPlay is still evolving, with plans for many exciting features:
              </p>
              
              <ul>
                <li>Team formation tools for organizing balanced matches</li>
                <li>Integration with messaging platforms for easier communication</li>
                <li>Weather forecasts for outdoor games</li>
                <li>Ratings and reviews for venues</li>
                <li>A points system to recognize regular players and organizers</li>
              </ul>
              
              <p>
                The vision for GroundPlay goes beyond just being a platform for organizing games—it's about building communities around shared interests in sports and physical activities.
              </p>
              
              <p>
                By making it easier for people to connect through sports, GroundPlay aims to promote more active lifestyles, strengthen community bonds, and make sports more accessible to everyone.
              </p>
              
              <h3 className="text-2xl font-bold mt-8 mb-4">Join the Community</h3>
              
              <p>
                Whether you're looking to find a game to join, need players for your regular match, or just want to meet new people who share your passion for sports, GroundPlay is built for you.
              </p>
              
              <p>
                I invite you to be part of this journey—create games, join others, provide feedback, and help shape the future of this platform. Together, we can build a vibrant community that celebrates the joy of playing sports together.
              </p>
              
              <p className="text-lg font-semibold mt-8">
                See you on the field!
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StoryPage;