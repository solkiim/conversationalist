require 'rubygems'
require 'sinatra'
require 'json'
#require "sinatra/json"
#require 'sequel'

current_volumes = {}
talk_counts = Hash.new(0)

get '/' do
	redirect to('/index.html')
end

post '/room.html' do
	@nameR = params[:Name]
	roomR = params[:Room]
	redirect to('/room.html')
end

get '/room.html' do
	send_file('/room.html')
end

post '/data/userAndVolume' do
	#puts "hey"
	user = params['user']
  	vol = params['volume']

  	current_volumes[user, vol]
  	max_val = current_volumes.values.max
  	maximum_users = current_volumes.select {|k,v| v == max_val}

  	maximum_users.each do |user,volume|
  		talk_counts[user] += 1
  	end

  	json :talk_counts
end

get '/test' do
	send_file('/test.html')
end

