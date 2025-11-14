import React from 'react';
import DashboardAdminLayout from '../../../DashboardAdminLayout';

const SkeletonLoader = () => {
  return (
    <DashboardAdminLayout>
      <div className="space-y-8">
        {/* En-tête skeleton - Très visible */}
        <div className="flex justify-between items-center">
          {/* HeaderCard skeleton */}
          <div className="flex-1">
            <div className="h-7 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg w-64 mb-3 shimmer-animation"></div>
            <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-48 shimmer-animation" style={{ animationDelay: '0.1s' }}></div>
          </div>
          
          {/* RecentActivity skeleton */}
          <div className="bg-white rounded-3xl shadow-lg px-6 py-3 border-2 border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 p-3 rounded-xl w-10 h-10 shimmer-animation"></div>
              <div className="h-5 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-20 shimmer-animation" style={{ animationDelay: '0.2s' }}></div>
              <div className="bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-full w-7 h-7 shimmer-animation" style={{ animationDelay: '0.3s' }}></div>
            </div>
          </div>
        </div>

        {/* Métriques skeleton - Animation en cascade */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Administrateurs", value: "24", subtitle: true, badge: "w-32" },
            { title: "Vendeurs", value: "156", subtitle: false, badge: "w-28" },
            { title: "Performance", value: "45ms", subtitle: false, badge: "w-24" },
            { title: "En attente", value: "12", subtitle: true, badge: "w-36" }
          ].map((metric, i) => (
            <div 
              key={i}
              className="bg-white rounded-3xl shadow-xl p-5 border-2 border-gray-200 hover:shadow-2xl transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  {/* Titre */}
                  <div 
                    className="h-5 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg w-3/4 mb-4 shimmer-animation"
                    style={{ animationDelay: `${0.4 + i * 0.1}s` }}
                  ></div>
                  
                  {/* Valeur principale */}
                  <div 
                    className="h-10 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-xl w-1/2 mb-3 shimmer-animation"
                    style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                  ></div>
                  
                  {/* Subtitle pour certaines cartes */}
                  {metric.subtitle && (
                    <div 
                      className="h-7 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg w-24 mb-3 shimmer-animation"
                      style={{ animationDelay: `${0.6 + i * 0.1}s` }}
                    ></div>
                  )}
                  
                  {/* Badge */}
                  <div 
                    className={`h-7 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-full ${metric.badge} shimmer-animation`}
                    style={{ animationDelay: `${0.7 + i * 0.1}s` }}
                  ></div>
                </div>
                
                {/* Icône */}
                <div 
                  className="w-14 h-14 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-2xl shimmer-animation"
                  style={{ animationDelay: `${0.8 + i * 0.1}s` }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Graphiques skeleton - Animations distinctes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AreaChart skeleton */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-200">
            <div 
              className="h-7 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg w-48 mb-6 shimmer-animation"
              style={{ animationDelay: '0.9s' }}
            ></div>
            
            <div className="h-80 bg-gray-100 rounded-2xl relative overflow-hidden border-2 border-gray-300">
              {/* Fond du graphique avec animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 shimmer-animation"></div>
              
              {/* Courbes simulées */}
              <div className="absolute inset-0 flex items-end px-4 pb-8">
                <div className="w-full h-3/4 bg-gradient-to-t from-gray-300 to-gray-200 rounded-t-2xl shimmer-animation" style={{ animationDelay: '1.0s' }}></div>
              </div>
              
              {/* Points sur les courbes */}
              <div className="absolute bottom-16 left-1/4 w-3 h-3 bg-gray-400 rounded-full shimmer-animation" style={{ animationDelay: '1.1s' }}></div>
              <div className="absolute bottom-24 left-2/4 w-3 h-3 bg-gray-400 rounded-full shimmer-animation" style={{ animationDelay: '1.2s' }}></div>
              <div className="absolute bottom-32 left-3/4 w-3 h-3 bg-gray-400 rounded-full shimmer-animation" style={{ animationDelay: '1.3s' }}></div>

              {/* Légende */}
              <div className="absolute top-4 right-4 space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded shimmer-animation" style={{ animationDelay: '1.4s' }}></div>
                  <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-24 shimmer-animation" style={{ animationDelay: '1.5s' }}></div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded shimmer-animation" style={{ animationDelay: '1.6s' }}></div>
                  <div className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-20 shimmer-animation" style={{ animationDelay: '1.7s' }}></div>
                </div>
              </div>
              
              {/* Axe Y */}
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 space-y-12">
                {[...Array(3)].map((_, i) => (
                  <div 
                    key={i}
                    className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-10 shimmer-animation"
                    style={{ animationDelay: `${1.8 + i * 0.1}s` }}
                  ></div>
                ))}
              </div>
              
              {/* Axe X */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-between px-6">
                {[...Array(5)].map((_, i) => (
                  <div 
                    key={i}
                    className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-14 shimmer-animation"
                    style={{ animationDelay: `${2.1 + i * 0.1}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {/* DonutChart skeleton */}
          <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-200">
            <div 
              className="h-7 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg w-56 mx-auto mb-6 shimmer-animation"
              style={{ animationDelay: '2.6s' }}
            ></div>
            
            <div className="flex flex-col lg:flex-row items-center">
              {/* Graphique donut */}
              <div className="flex-1 h-80 flex items-center justify-center">
                <div className="relative">
                  {/* Cercle externe */}
                  <div 
                    className="w-48 h-48 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-full shimmer-animation"
                    style={{ animationDelay: '2.7s' }}
                  ></div>
                  
                  {/* Cercle interne */}
                  <div className="absolute inset-0 m-auto w-24 h-24 bg-white rounded-full border-2 border-gray-200"></div>
                  
                  {/* Texte au centre */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div 
                      className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-16 mb-2 shimmer-animation"
                      style={{ animationDelay: '2.8s' }}
                    ></div>
                    <div 
                      className="h-6 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded w-12 shimmer-animation"
                      style={{ animationDelay: '2.9s' }}
                    ></div>
                  </div>
                  
                  {/* Segments simulés */}
                  <div className="absolute top-0 left-1/2 w-1 h-24 bg-gray-400 transform -translate-x-1/2 shimmer-animation" style={{ animationDelay: '3.0s' }}></div>
                  <div className="absolute top-1/2 right-0 w-24 h-1 bg-gray-400 transform -translate-y-1/2 shimmer-animation" style={{ animationDelay: '3.1s' }}></div>
                  <div className="absolute bottom-0 left-1/4 w-1 h-24 bg-gray-400 transform -translate-x-1/2 rotate-45 shimmer-animation" style={{ animationDelay: '3.2s' }}></div>
                </div>
              </div>
              
              {/* Légende */}
              <div className="flex-1 space-y-4 mt-8 lg:mt-0 lg:pl-8">
                {[
                  { color: 'from-red-300 via-red-200 to-red-300', width: 'w-24' },
                  { color: 'from-blue-300 via-blue-200 to-blue-300', width: 'w-20' },
                  { color: 'from-green-300 via-green-200 to-green-300', width: 'w-28' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center">
                      <div 
                        className={`w-5 h-5 bg-gradient-to-r ${item.color} rounded mr-4 shimmer-animation`}
                        style={{ animationDelay: `${3.3 + i * 0.2}s` }}
                      ></div>
                      <div 
                        className={`h-5 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded ${item.width} shimmer-animation`}
                        style={{ animationDelay: `${3.4 + i * 0.2}s` }}
                      ></div>
                    </div>
                    <div 
                      className="h-5 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-12 shimmer-animation"
                      style={{ animationDelay: `${3.5 + i * 0.2}s` }}
                    ></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section activité récente */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-gray-200">
          <div 
            className="h-7 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-lg w-48 mb-6 shimmer-animation"
            style={{ animationDelay: '3.9s' }}
          ></div>
          
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div 
                key={i}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all duration-300"
              >
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded-full shimmer-animation"
                    style={{ animationDelay: `${4.0 + i * 0.1}s` }}
                  ></div>
                  <div className="space-y-2">
                    <div 
                      className="h-5 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-32 shimmer-animation"
                      style={{ animationDelay: `${4.1 + i * 0.1}s` }}
                    ></div>
                    <div 
                      className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-24 shimmer-animation"
                      style={{ animationDelay: `${4.2 + i * 0.1}s` }}
                    ></div>
                  </div>
                </div>
                <div className="space-y-2 text-right">
                  <div 
                    className="h-4 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-16 ml-auto shimmer-animation"
                    style={{ animationDelay: `${4.3 + i * 0.1}s` }}
                  ></div>
                  <div 
                    className="h-6 bg-gradient-to-r from-gray-300 via-gray-200 to-gray-300 rounded w-20 ml-auto shimmer-animation"
                    style={{ animationDelay: `${4.4 + i * 0.1}s` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Styles CSS pour l'animation shimmer très visible */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -468px 0;
          }
          100% {
            background-position: 468px 0;
          }
        }
        
        .shimmer-animation {
          animation: shimmer 2s infinite linear;
          background: linear-gradient(to right, #f6f7f8 8%, #edeef1 18%, #f6f7f8 33%);
          background-size: 800px 104px;
          position: relative;
        }
        
        /* Animation encore plus visible avec plus de contraste */
        @keyframes strong-shimmer {
          0% {
            background-position: -1000px 0;
          }
          100% {
            background-position: 1000px 0;
          }
        }
        
        .shimmer-animation {
          animation: strong-shimmer 1.5s infinite linear;
          background: linear-gradient(
            to right,
            #f0f0f0 0%,
            #e0e0e0 20%,
            #f0f0f0 40%,
            #f0f0f0 100%
          );
          background-size: 1000px 100%;
        }
      `}</style>
    </DashboardAdminLayout>
  );
};

export default SkeletonLoader;